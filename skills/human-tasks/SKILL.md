---
name: human-tasks
description: Route a step back to the operator when it genuinely needs a human — a judgment call, a real-world action an agent can't take, or a decision outside the agents' authority. Use when work can't proceed without the person. Used by every agent.
---

# human-tasks

Some steps only a human can do: a judgment call the system shouldn't make, an action in the
physical/relationship world, a decision above the agents' authority. This skill packages
that step cleanly and hands it up — so it's a crisp ask, not a vague "help."

## When to route to the human

- A borderline lead the scorer flagged `human-review`.
- An outreach reply that needs a real relationship decision (pricing, scope, a favor).
- Anything requiring the operator's identity, accounts, or physical presence.
- A conflict with `guardrails-reference` that needs the operator's call.

## How to package it

Make it answerable in one breath:

```
[human] <what's needed> — <the context in one line> — <the specific decision or action>
e.g. "Petpal replied asking for a discount — they're a strong-fit lead scored 84 — how low
      will you go, or should I hold the line at list price?"
```

Attach the link to the relevant lead/task so the operator has one click to the full context.

## Rules

- **One clear ask.** Not "here's a situation" — "here's the decision I need."
- Surface via the operator's channel (by voice, since that's how they work), or into the
  morning briefing if it's not urgent.
- Leave the work in a clean paused state with a `next_action` so it resumes the instant the
  human answers.

## Guardrails

- Don't route to the human to avoid doing your job — only genuine human-required steps.
  Everything an agent can validly do, it does (then gates the external part via `approvals`).
- Don't proceed on a human-required step by guessing the answer.
