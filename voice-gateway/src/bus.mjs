// Minimal file-bus client for talking to the cortextOS orchestrator.
//
// We drop an inbound message into the agent's inbox and watch its outbox for a
// reply keyed by the same conversation id. This mirrors cortextOS's file-bus
// model without depending on its internals: if the real bus uses different
// folder names, only these two path helpers need to change.
import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

export class Bus {
  constructor({ home, agent }) {
    this.root = resolve(process.cwd(), home);
    this.agent = agent;
    this.inbox = join(this.root, 'bus', agent, 'inbox');
    this.outbox = join(this.root, 'bus', agent, 'outbox');
  }

  reachable() {
    // The fleet is considered up if the agent's bus directory exists.
    return existsSync(join(this.root, 'bus', this.agent));
  }

  ensure() {
    for (const d of [this.inbox, this.outbox]) if (!existsSync(d)) mkdirSync(d, { recursive: true });
  }

  /** Write an inbound utterance for the orchestrator. Returns the conversation id. */
  send(text, meta = {}) {
    this.ensure();
    const id = randomUUID();
    const msg = { id, from: 'voice-gateway', to: this.agent, kind: 'user-utterance', text, meta, at: new Date().toISOString() };
    // Write atomically: temp then rename, so the agent never reads a half-written file.
    const tmp = join(this.inbox, `.${id}.tmp`);
    writeFileSync(tmp, JSON.stringify(msg, null, 2));
    renameSync(tmp, join(this.inbox, `${id}.json`));
    return id;
  }

  /** Poll the outbox for a reply to `id`. Resolves with the reply text or null on timeout. */
  async awaitReply(id, timeoutMs = 60000, pollMs = 400) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (existsSync(this.outbox)) {
        for (const f of readdirSync(this.outbox)) {
          if (!f.endsWith('.json')) continue;
          const p = join(this.outbox, f);
          let reply;
          try { reply = JSON.parse(readFileSync(p, 'utf8')); } catch { continue; }
          if (reply.reply_to === id || reply.id === id) {
            // consume it so we don't re-read
            try { renameSync(p, `${p}.consumed`); } catch {}
            return reply.text ?? '';
          }
        }
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
    return null;
  }
}
