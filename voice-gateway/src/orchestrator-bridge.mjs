// Bridges a spoken utterance to the orchestrator agent and returns its reply.
//
// Real path: write the utterance to the cortextOS file bus, await the boss
// agent's reply. Mock path (fleet not running, or ATLAS_VOICE_MOCK=1): return a
// helpful canned reply so the whole voice loop can be tested standalone.
import { Bus } from './bus.mjs';
import { config } from './config.mjs';

export class OrchestratorBridge {
  constructor() {
    this.bus = new Bus(config.bus);
  }

  get mode() {
    return config.bus.mock || !this.bus.reachable() ? 'mock' : 'live';
  }

  /** @returns {Promise<{text:string, mode:string}>} */
  async ask(utterance, meta = {}) {
    if (this.mode === 'mock') return { text: mockReply(utterance), mode: 'mock' };

    const id = this.bus.send(utterance, meta);
    const text = await this.bus.awaitReply(id, config.bus.replyTimeoutMs);
    if (text == null) {
      return { text: "I dispatched that to the team but haven't heard back yet — I'll surface it in your next briefing.", mode: 'live-timeout' };
    }
    return { text, mode: 'live' };
  }
}

// A stand-in for the orchestrator so the voice interface is demoable without the
// fleet. It mirrors how Atlas would actually respond: brief, decision-first.
function mockReply(u) {
  const t = (u || '').toLowerCase();
  if (/morning|today|what.?s on|briefing/.test(t))
    return 'Good morning. Three things need you: two drafts to approve and one borderline lead. Six new leads came in overnight — top one scored 88. Want the approvals first, the leads, or the blockers?';
  if (/approve|send it|yes/.test(t))
    return "Approved — I'll send it and log it. Anything else?";
  if (/no|hold|reject/.test(t))
    return "Held. I won't send it. Want me to revise the draft instead?";
  if (/find|source|leads?|outreach/.test(t))
    return "On it. I'll have the research team source and score against your ICP, then draft outreach for the qualified ones. Nothing sends until you approve it. I'll brief you when the first batch is ready.";
  if (/status|open|pending|what needs/.test(t))
    return 'Open right now: two approvals waiting on you, three tasks in flight, one lead going stale. Want the details?';
  return "Got it. I'll break that into tasks for the team and keep the approval line on anything that leaves the system. (Fleet isn't running yet — this is the voice loop in mock mode; start it with `npm run fleet:start`.)";
}
