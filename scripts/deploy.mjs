#!/usr/bin/env node
// Deploy Atlas's lead-gen skills and per-agent CLAUDE.md configs into the
// cortextOS agent working directories.
//
// cortextOS stores skills as `.claude/skills/<skill>/SKILL.md` inside each
// agent's home. Agent homes live under CORTEXTOS_HOME. Because the exact
// on-disk layout can vary by cortextOS version, we locate each agent home by
// searching for a directory named after the agent instance, and fall back to a
// conventional path if the search finds nothing.
import 'dotenv/config';
import { existsSync, readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { copyDir, ensureDir, log, warn, paths, FLEET } from './lib/util.mjs';

/** Depth-limited search for a directory whose basename === target. */
function findDir(root, target, depth = 5) {
  if (!existsSync(root) || depth < 0) return null;
  let entries;
  try { entries = readdirSync(root); } catch { return null; }
  for (const e of entries) {
    if (e === 'node_modules' || e === '.git') continue;
    const p = join(root, e);
    let s; try { s = statSync(p); } catch { continue; }
    if (!s.isDirectory()) continue;
    if (e === target) return p;
    const found = findDir(p, target, depth - 1);
    if (found) return found;
  }
  return null;
}

function agentHome(instance) {
  const home = paths.home();
  const org = paths.org();
  // cortextOS keeps agents at <framework root>/orgs/<org>/agents/<name>
  // (bootstrap runs every cortextos command from inside cortextos/, so that's
  // where `init`/`add-agent` put them). Older layouts are kept as fallbacks.
  const candidates = [
    join(paths.cortextos, 'orgs', org, 'agents', instance),
    join(home, 'orgs', org, 'agents', instance),
    join(home, org, 'agents', instance),
    join(home, 'agents', instance),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return findDir(home, instance) || candidates[0];
}

/** Read the newline-separated skill list an agent declares. */
function skillsFor(role) {
  const f = join(paths.agents, role, 'skills.txt');
  if (!existsSync(f)) return [];
  return readFileSync(f, 'utf8').split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
}

export async function deploy() {
  let deployed = 0;
  for (const [instance, , role] of FLEET) {
    const roleDir = join(paths.agents, role);
    if (!existsSync(roleDir)) { warn(`no config dir for role "${role}" — skipping`); continue; }

    const home = agentHome(instance);
    ensureDir(home);
    const claudeDir = ensureDir(join(home, '.claude'));
    const skillsDir = ensureDir(join(claudeDir, 'skills'));

    // 1. CLAUDE.md — the agent's operating instructions.
    const md = join(roleDir, 'CLAUDE.md');
    if (existsSync(md)) writeFileSync(join(home, 'CLAUDE.md'), readFileSync(md, 'utf8'));

    // 2. Skills — copy each declared skill from our shared skills/ library.
    for (const skill of skillsFor(role)) {
      const src = join(paths.skills, skill);
      if (!existsSync(src)) { warn(`${role}: skill "${skill}" not found in skills/ — skipping`); continue; }
      copyDir(src, join(skillsDir, skill));
    }
    log(`${instance.padEnd(11)} → ${home}`);
    deployed++;
  }
  if (deployed === 0) warn('No agent homes were written. Run `npm run bootstrap` first so cortextOS creates the agents.');
  return deployed;
}

// Allow running standalone: `node scripts/deploy.mjs`
if (import.meta.url === `file://${process.argv[1]}`) deploy();
