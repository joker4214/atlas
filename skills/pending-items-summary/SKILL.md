---
name: pending-items-summary
description: Surface every open item and its status on demand — pending approvals, borderline leads, in-flight tasks, stale work — so nothing is silently waiting. Use when the operator asks "what's open?" or "what needs me?". Used by the Orchestrator.
---

# pending-items-summary

Answers "what's waiting on me / on the team right now?" in one honest sweep. Where the
briefings are scheduled, this is on-demand — the operator can ask any time and get the true
open state.

## What to gather

- **Needs the operator** — pending approvals (`knowledge-base/approvals/` status: pending)
  and `human-review` leads. Highest priority; only they can clear these.
- **In flight** — tasks on the board that are `in_progress`, with owner and age.
- **Waiting on a reply** — leads at `stage: outreach`/`replied` with a `next_action` due.
- **Stale / stuck** — anything past its `next_action_due` or flagged by `system-diagnostics`.

## Output

Grouped, counted, most-actionable first:

```
Needs you (2): approve Posh Pets email · borderline lead CreativeSignet (score 63)
In flight (3): briefing 4 pet stores (researcher) · scoring queue (researcher) · weekly synth (analyst)
Waiting on reply (2): Petpal (follow-up due today) · Woof M-E-O-W (due 7/18)
Stale (1): Website-redo task — no movement 3 days
```

Keep it speakable if delivered by voice: counts first, then drill in on request.

## Guardrails

- Show the real state, including the ugly parts (stale items). The value is honesty, not a
  tidy-looking list.
- Don't double-count an item across groups — put it in the most urgent one.
