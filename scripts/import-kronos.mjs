#!/usr/bin/env node
// OPTIONAL: seed Atlas's knowledge base from an existing "second brain" folder
// (e.g. a Kronos/OneDrive vault with a Brand Guide, Voice, and CRM leads).
//
// This is a convenience importer, not a coupling — Atlas stands alone. Point
// SOURCE at your vault and run `npm run import:kronos`. It copies matching
// source docs into knowledge-base/seed/imported/ for you to fold into the seed
// files; it never overwrites your curated seed/*.md automatically.
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ensureDir, log, step, warn, ROOT } from './lib/util.mjs';

// Edit this to your source vault. Default guesses a sibling Kronos OneDrive vault.
const SOURCE = process.env.IMPORT_SOURCE || join(ROOT, '..', 'OneDrive', 'Kronos');
const OUT = ensureDir(join(ROOT, 'knowledge-base', 'seed', 'imported'));

// Map source docs → what they inform in Atlas's seed.
const MAP = [
  { match: /brand guide/i,     informs: 'voice.md + offer.md' },
  { match: /voice/i,           informs: 'voice.md' },
  { match: /story|beliefs/i,   informs: 'offer.md (positioning)' },
  { match: /leads?/i,          informs: 'leads/ (existing CRM)' },
  { match: /live priorities/i, informs: 'context for the orchestrator' },
];

function walk(dir, depth = 3, acc = []) {
  if (depth < 0 || !existsSync(dir)) return acc;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    let s; try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) walk(p, depth - 1, acc);
    else if (/\.(md|txt)$/i.test(e)) acc.push(p);
  }
  return acc;
}

step(`Importing from ${SOURCE}`);
if (!existsSync(SOURCE)) {
  warn(`source not found: ${SOURCE}`);
  warn('Set IMPORT_SOURCE=/path/to/your/vault and re-run, or just fill in seed/*.md by hand.');
  process.exit(0);
}

let n = 0;
for (const file of walk(SOURCE)) {
  const base = file.split('/').pop();
  const hit = MAP.find((m) => m.match.test(file));
  if (!hit) continue;
  const dest = join(OUT, base);
  writeFileSync(dest, readFileSync(file, 'utf8'));
  log(`${base}  →  informs ${hit.informs}`);
  n++;
}

console.log(`\nImported ${n} doc(s) to knowledge-base/seed/imported/.`);
console.log('Review them, then fold the relevant parts into seed/icp.md, voice.md, offer.md,');
console.log('sources.md by hand — that keeps your curated seed clean and intentional.');
