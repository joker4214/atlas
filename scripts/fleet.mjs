#!/usr/bin/env node
// Thin wrapper over cortextOS + PM2 for running the fleet.
//   node scripts/fleet.mjs start|status|stop
import 'dotenv/config';
import { has, run, paths, step, warn } from './lib/util.mjs';

const cmd = process.argv[2] || 'status';
process.env.CORTEXTOS_HOME = paths.home();

function cortextos(args) {
  const bin = has('cortextos') ? 'cortextos' : `node ${paths.cortextos}/bin/cortextos.mjs`;
  return run(`${bin} ${args}`, { soft: true });
}

switch (cmd) {
  case 'start':
    step('Starting the Atlas fleet');
    if (!has('pm2')) warn('pm2 not found — install with `npm i -g pm2` for 24/7 running.');
    // PM2 keeps every agent alive and restarts on crash/reboot.
    run('pm2 start ecosystem.config.js', { soft: true });
    run('pm2 save', { soft: true });
    cortextos('start boss');
    console.log('\nFleet up. `npm run fleet:status` for the health table. `npm run voice` to talk to it.');
    break;
  case 'status':
    step('Fleet health');
    cortextos('status');
    run('pm2 status', { soft: true });
    break;
  case 'stop':
    step('Stopping the fleet');
    run('pm2 stop ecosystem.config.js', { soft: true });
    break;
  default:
    console.log('usage: node scripts/fleet.mjs start|status|stop');
}
