---
name: delivery-routing
description: Send each scored lead down the correct next lane — outreach, nurture, human-review, or drop — based on its score and qualification, so qualified leads move automatically and only borderline calls reach the human. Use right after a lead is scored. Used by the Lead Research and Orchestrator agents.
---

# delivery-routing

After a lead is scored, it needs to go somewhere. This skill is the switchboard: it reads
the scorer's verdict and moves the lead into the right lane so the pipeline flows without
the operator hand-sorting a pile every morning.

## The lanes

Read `route` (set by `signal-scoring`) and act:

| `route` | Meaning | Action |
|---|---|---|
| `outreach` | Qualified + ready | Assign to the Outreach agent; set `stage: outreach`, `owner: outreacher`, queue a `relationship-review` task. |
| `nurture` | Pain-qualified, not ready | Hand to the Content agent's nurture track; set `stage: nurture`. Not a dead lead — a slow one. |
| `human-review` | Borderline (in the scoring band) | **Do not guess.** Add to the operator's review queue; it surfaces in the morning briefing / by voice. |
| `needs-research` | Brief too thin to score | Send back to `brief-generation`. |
| `drop` | Not our ICP / dead | Set `stage: lost`, one-line reason. Keep the record (dedup + learning). |

## Rules

- **Automatic for the clear cases, human for the ambiguous ones.** The system's job is to
  remove sorting toil, not to make judgment calls it shouldn't. Borderline always goes to
  the human — that's the design, not a fallback.
- One lead, one active lane. Update the frontmatter, don't leave it in two places.
- Log the routing decision to the activity feed (`event-logging`) so the flow is visible.

## Output

Update the lead frontmatter (`stage`, `owner`, `next_action`) and, for `human-review`,
add a compact entry to the operator's review queue:

```
[review] <lead name> — score 63 (borderline) — <the one-line reason it's a judgment call>
```

## Guardrails

- Never route a `human-review` lead to `outreach` on your own initiative — the whole point
  is that the human breaks ties.
- If `route` is missing, the lead wasn't scored — send it to `signal-scoring`, don't invent
  a lane.
