#!/usr/bin/env node
// Thin wrapper over cortextOS + PM2 for running the fleet.
//   node scripts/fleet.mjs start|status|stop
import 'dotenv/config';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { has, run, step, warn, ROOT, FLEET, cortextos } from './lib/util.mjs';

const cmd = process.argv[2] || 'status';
const ECOSYSTEM = join(ROOT, 'ecosystem.config.cjs');

switch (cmd) {
  case 'start':
    step('Starting the Atlas fleet');
    if (!has('claude')) warn('`claude` (Claude Code) not installed — agents will fail to start. Fix: sudo npm i -g @anthropic-ai/claude-code, then run `claude` once to log in.');
    if (!has('pm2')) warn('pm2 not found — install with `sudo npm i -g pm2` for 24/7 running.');
    if (!existsSync(ECOSYSTEM)) warn('ecosystem.config.cjs missing — run `npm run bootstrap` first.');
    // PM2 keeps the cortextos daemon alive and restarts it on crash/reboot.
    run(`pm2 start ${JSON.stringify(ECOSYSTEM)}`, { soft: true });
    run('pm2 save', { soft: true });
    // Ask the daemon to bring up each agent (idempotent if already running).
    for (const [name] of FLEET) cortextos(`start ${name}`);
    console.log('\nFleet up. `npm run fleet:status` for the health table. `npm run voice` to talk to it.');
    break;
  case 'status':
    step('Fleet health');
    cortextos('status');
    run('pm2 status', { soft: true });
    break;
  case 'stop':
    step('Stopping the fleet');
    cortextos('stop', {});
    run(`pm2 stop ${JSON.stringify(ECOSYSTEM)}`, { soft: true });
    break;
  default:
    console.log('usage: node scripts/fleet.mjs start|status|stop');
}
