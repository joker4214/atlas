// Smoke tests for the voice gateway's bus + orchestrator bridge.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Bus } from '../src/bus.mjs';

test('mock reply path responds without a running fleet', async () => {
  // Fresh env: no bus dir => bridge should be in mock mode.
  process.env.CORTEXTOS_HOME = mkdtempSync(join(tmpdir(), 'atlas-nofleet-'));
  process.env.ATLAS_VOICE_MOCK = '1';
  const { OrchestratorBridge } = await import('../src/orchestrator-bridge.mjs?nofleet');
  const bridge = new OrchestratorBridge();
  assert.equal(bridge.mode, 'mock');
  const { text } = await bridge.ask("what's on today?");
  assert.match(text, /need you|approve|leads/i, 'mock morning briefing shape');
});

test('bus writes an utterance and reads a matching reply', async () => {
  const home = mkdtempSync(join(tmpdir(), 'atlas-bus-'));
  const agent = 'boss';
  mkdirSync(join(home, 'bus', agent), { recursive: true });   // makes the fleet "reachable"
  const bus = new Bus({ home, agent });
  assert.equal(bus.reachable(), true);

  const id = bus.send('find 5 shopify stores running ads');
  // the utterance landed in the inbox
  const inbox = readdirSync(bus.inbox).filter((f) => f.endsWith('.json'));
  assert.equal(inbox.length, 1);
  const written = JSON.parse(readFileSync(join(bus.inbox, inbox[0]), 'utf8'));
  assert.equal(written.text, 'find 5 shopify stores running ads');
  assert.equal(written.kind, 'user-utterance');

  // simulate the orchestrator replying
  mkdirSync(bus.outbox, { recursive: true });
  writeFileSync(join(bus.outbox, 'r1.json'), JSON.stringify({ reply_to: id, text: 'On it — sourcing now.' }));

  const reply = await bus.awaitReply(id, 3000, 50);
  assert.equal(reply, 'On it — sourcing now.');
});

test('awaitReply times out cleanly when no reply arrives', async () => {
  const home = mkdtempSync(join(tmpdir(), 'atlas-timeout-'));
  mkdirSync(join(home, 'bus', 'boss'), { recursive: true });
  const bus = new Bus({ home, agent: 'boss' });
  const id = bus.send('hello');
  const reply = await bus.awaitReply(id, 300, 50);
  assert.equal(reply, null);
});
