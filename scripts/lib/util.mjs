// Shared helpers for the Atlas setup scripts.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(HERE, '..', '..');           // the atlas/ folder

export const log = (...a) => console.log('  ', ...a);
export const step = (m) => console.log(`\n\x1b[1m▸ ${m}\x1b[0m`);
export const warn = (m) => console.warn(`\x1b[33m  ! ${m}\x1b[0m`);
export const die = (m) => { console.error(`\x1b[31m✗ ${m}\x1b[0m`); process.exit(1); };

/** Run a shell command, streaming output. Returns true on success. */
export function run(cmd, opts = {}) {
  log(`$ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: opts.cwd || ROOT, env: process.env, ...opts });
    return true;
  } catch (e) {
    if (opts.soft) { warn(`command failed (continuing): ${cmd}`); return false; }
    throw e;
  }
}

/** Is a binary on PATH? */
export function has(bin) {
  try { execSync(process.platform === 'win32' ? `where ${bin}` : `command -v ${bin}`, { stdio: 'ignore' }); return true; }
  catch { return false; }
}

export function ensureDir(p) { if (!existsSync(p)) mkdirSync(p, { recursive: true }); return p; }

/** Recursively copy a directory tree. */
export function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of readdirSync(src)) {
    const s = join(src, entry), d = join(dest, entry);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

export const paths = {
  cortextos: join(ROOT, 'cortextos'),
  agents: join(ROOT, 'agents'),
  skills: join(ROOT, 'skills'),
  kbSeed: join(ROOT, 'knowledge-base', 'seed'),
  home: () => resolve(ROOT, process.env.CORTEXTOS_HOME || './.cortextos'),
  org: () => process.env.ATLAS_ORG || 'atlas',
};

/**
 * Run a cortextOS CLI command.
 *
 * cortextOS assumes ONE directory is both the framework (dist/, templates/)
 * and the workspace (orgs/ with the agents). Its commands resolve that root
 * from CTX_FRAMEWORK_ROOT or process.cwd(). So every cortextos command must
 * run from inside the vendored framework dir with the env set — otherwise
 * orgs/ ends up in one place, dist/daemon.js is looked up in another, and
 * the daemon reports "No agents running".
 */
export function cortextos(args, opts = {}) {
  const cli = join(paths.cortextos, 'dist', 'cli.js');
  if (!existsSync(cli)) {
    warn(`cortextOS CLI not built (${cli}). Run \`npm run bootstrap\` first.`);
    return false;
  }
  return run(`node ${JSON.stringify(cli)} ${args}`, {
    cwd: paths.cortextos,
    soft: true,
    env: {
      ...process.env,
      CTX_FRAMEWORK_ROOT: paths.cortextos,
      CTX_PROJECT_ROOT: paths.cortextos,
    },
    ...opts,
  });
}

/** The 6 agents that make up the fleet: [instanceName, cortextOS template]. */
export const FLEET = [
  ['boss',       'orchestrator', 'orchestrator'],
  ['researcher', 'agent',        'lead-research'],
  ['outreacher', 'agent',        'outreach'],
  ['content',    'agent',        'content'],
  ['analyst',    'analyst',      'analytics'],
  ['ops',        'agent',        'ops-health'],
];
