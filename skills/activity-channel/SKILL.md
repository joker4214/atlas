---
name: activity-channel
description: Broadcast finished work to the rest of the team so other agents can build on it — a completed brief, a published post, a new scoring model. Use when an output is ready for others to consume. Used by the Content and specialist agents.
---

# activity-channel

Where `event-logging` records *that* something happened, this skill *broadcasts* a finished
artifact so other agents act on it. It's how the Content agent tells the team "new market
digest is up," or the Analyst says "new scoring weights are live — re-score the queue."

## When to broadcast

- A reusable artifact is finished and banked: a market digest, a content piece, an updated
  scoring model, a batch of fresh briefs.
- The artifact changes what another agent should do next.

## How

Write a broadcast message on the bus + a feed line, pointing at the artifact in the KB:

```
[broadcast] content → team: market digest "pet ecom Q3" published (kb/content/pet-ecom-q3.md).
            Outreach can reference it; Research can mine it for angles.
```

Include: what it is, where it lives, and who should do what with it. A broadcast with no
"so what" is just noise — say what to do next.

## Guardrails

- Broadcast finished work, not work-in-progress. Half-done artifacts create churn.
- Don't broadcast external publication before it's approved — internal "ready to publish"
  and actually-published are different events.
