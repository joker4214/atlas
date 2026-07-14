#!/usr/bin/env node
// Atlas bootstrap: clone cortextOS, create the org, add the 6-agent fleet,
// deploy our lead-gen skills + CLAUDE.md configs, and seed the knowledge base.
//
// Safe to re-run: every step checks for existing state before acting.
import 'dotenv/config';
import { existsSync } from 'node:fs';
import { run, has, step, log, warn, die, paths, FLEET } from './lib/util.mjs';
import { deploy } from './deploy.mjs';

const CORTEXTOS_REPO = 'https://github.com/grandamenium/cortextos.git';

function preflight() {
  step('Preflight');
  if (!has('node')) die('Node.js 20+ is required.');
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) die(`Node ${process.versions.node} found; Atlas needs 20+.`);
  if (!has('git')) die('git is required.');
  if (!has('claude')) warn('`claude` (Claude Code) not on PATH — install with: npm i -g @anthropic-ai/claude-code && claude login');
  if (!has('pm2')) warn('`pm2` not on PATH — install with: npm i -g pm2 (needed for 24/7 running)');
  log(`node ${process.versions.node} ✓`);
}

function getCortextos() {
  step('cortextOS framework');
  if (existsSync(paths.cortextos)) { log('already present, skipping clone'); }
  else run(`git clone --depth 1 ${CORTEXTOS_REPO} cortextos`);
  run('npm install', { cwd: paths.cortextos });
  run('npm run build', { cwd: paths.cortextos, soft: true });
}

// Prefer a globally-linked `cortextos` CLI; otherwise call the local build.
function cortextos(args) {
  const local = `node ${paths.cortextos}/bin/cortextos.mjs`;
  const bin = has('cortextos') ? 'cortextos' : local;
  return run(`${bin} ${args}`, { soft: true });
}

function createOrgAndFleet() {
  const org = paths.org();
  step(`Org "${org}" + fleet`);
  process.env.CORTEXTOS_HOME = paths.home();
  cortextos('install');
  cortextos(`init ${org}`);
  for (const [name, template] of FLEET) {
    log(`add-agent ${name} (template: ${template})`);
    cortextos(`add-agent ${name} --template ${template} --org ${org}`);
  }
}

async function main() {
  console.log('\n\x1b[1m╭─ Atlas bootstrap ─────────────────────────────────╮\x1b[0m');
  preflight();
  getCortextos();
  createOrgAndFleet();

  step('Deploy lead-gen skills + agent configs');
  await deploy();

  step('Seed the knowledge base');
  run('node scripts/seed-kb.mjs', { soft: true });

  step('Generate the PM2 ecosystem config');
  cortextos('ecosystem');

  console.log(`
\x1b[1m╰─ Done ────────────────────────────────────────────╯\x1b[0m

Next:
  1. Fill in .env (STT/TTS keys at minimum).
  2. npm run fleet:start      # boot the 6 agents (24/7)
  3. npm run fleet:status     # confirm every agent is healthy
  4. npm run voice            # start talking to it

If any cortextOS step above printed a warning, that command couldn't run
headless here — finish it interactively per docs/SETUP.md, then re-run
\`npm run bootstrap\` (it's idempotent).
`);
}

main().catch((e) => die(e.stack || String(e)));
