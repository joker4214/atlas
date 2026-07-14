---
name: brief-generation
description: Build the full picture on a lead before any human time is spent — who they are, how the business is structured, and the signals worth acting on now — as a clean structured brief banked to the knowledge base. Use after a lead is sourced and before it is scored or contacted. Primary skill of the Lead Research agent.
---

# brief-generation

Builds the full picture on a lead so the operator spends zero minutes researching and only
minutes deciding. Takes a `stage: sourced` lead stub and turns it into a structured brief
with the evidence the scorer and the outreach drafter both need. Banks every brief so the
same work never gets done twice.

## Inputs

- The lead stub at `knowledge-base/leads/<id>.md`.
- The ICP and offer from `knowledge-base/seed/` (so the brief is framed against what we
  actually sell).
- `web-research` for fan-out search; `agent-browser` for anything behind a page interaction.

## The brief structure

Write the brief into the lead record, under the frontmatter, replacing the stub body:

```markdown
## Who they are
2–4 sentences. What the business does, who it serves, how it makes money.

## Business shape
- Platform / stack:
- Size signals (traffic, catalog size, team, funding if public):
- Decision-maker(s) and how they're reachable:

## Signals worth acting on now
- [signal] — [evidence + link] — [why it means "act now"]
- (This section feeds signal-scoring directly. Be specific and sourced.)

## The angle
The single most promising reason they'd want to talk to us, in one line, in plain
language. Tie it to our offer without pitching.

## Sources
- Every claim above, linked. No unsourced assertions.
```

Then set `stage: researched` in the frontmatter and record `researched_at`.

## Quality bar (before you set stage: researched)

- **Every signal is sourced.** If you can't link it, it's a hypothesis, not a signal — mark
  it as such or drop it.
- **No filler.** If the business shape is unknown, say "unknown" — don't pad. The scorer
  treats "unknown" honestly; it treats invented detail as real and mis-scores.
- Run `research-quality-review` on the brief before it lands if the lead is high-stakes.

## Bank it — the whole point

The brief lives in the knowledge base, keyed by lead id. Any agent (Outreach pulling
context, Content mining a case angle, the Orchestrator answering "what do we know about X")
reads it from there. Never hold a brief only in a message — if it isn't in the KB, it
didn't happen.

## Hand-off

Post a one-line activity-feed entry, then leave the lead at `stage: researched` for
`signal-scoring` to pick up. If research surfaced that this is clearly not our ICP, set
`route: drop` with a one-line reason and skip scoring.
