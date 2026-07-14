#!/usr/bin/env node
// Initialize the knowledge base runtime directories and a fresh activity feed.
// Idempotent: safe to run repeatedly. Does not touch the operator-owned seed/ files.
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ensureDir, log, step, ROOT } from './lib/util.mjs';

const KB = join(ROOT, 'knowledge-base');

step('Seeding knowledge-base runtime directories');
for (const d of ['leads', 'content', 'analytics', 'approvals', 'activity', 'health', 'index']) {
  ensureDir(join(KB, d));
  log(`knowledge-base/${d}/ ✓`);
}

// Make sure the seed files exist (they ship with the repo; warn if missing).
const seeds = ['icp.md', 'voice.md', 'offer.md', 'sources.md', 'scoring-weights.yaml'];
for (const s of seeds) {
  if (!existsSync(join(KB, 'seed', s))) log(`\x1b[33m! missing seed/${s} — fill it in before running the fleet\x1b[0m`);
}

// Start today's activity feed if absent.
const today = new Date().toISOString().slice(0, 10);
const feed = join(KB, 'activity', `${today}.md`);
if (!existsSync(feed)) {
  writeFileSync(feed, `# Activity feed — ${today}\n\n${new Date().toISOString()}  system  seeded  knowledge base ready\n`);
  log(`activity/${today}.md ✓`);
}

console.log('\nKnowledge base ready. Edit seed/icp.md first — everything keys off it.');
