---
name: autoresearch
description: Surface and pressure-test angles and opportunities on a schedule — dig into what changed in the market or a segment and why it matters — turning open-ended digging into structured findings. Use for proactive discovery, not a specific lead. Used by the Content and Analytics agents.
---

# autoresearch

Proactive digging. Where `brief-generation` researches a known lead, this hunts for what we
don't yet know: emerging angles, shifts in a segment, opportunities worth acting on. It runs
on a schedule (overnight) so the fleet gets smarter while the operator sleeps.

## What it does

- **Watches for change** in the ICP's world — new tools, new complaints, new spend, new
  entrants — using `web-research` and the source list.
- **Forms a question, then tests it.** Not "read about pet ecom" but "are pet stores moving
  spend off Meta, and does that create an opening for us?" — then find evidence for/against.
- **Turns findings into structured output** other skills consume: content angles
  (`topic-briefing`), scoring-weight hypotheses (`signal-scoring`/`weekly-review`), or new
  sources to add.

## Output

```markdown
# Autoresearch: <question>
date: 2026-07-13
verdict: supported | mixed | not-supported
evidence:
  - <finding + link>
so-what:
  - content: <angle for the Content agent, if any>
  - scoring: <weight hypothesis for the Analyst, if any>
  - sourcing: <new source/segment to try, if any>
```

Bank it in `knowledge-base/analytics/` and broadcast the "so-what" via `activity-channel`.

## Guardrails

- End with a verdict and a "so-what," or it's just reading. Every run must produce something
  the team can act on — or a clear "nothing here."
- Evidence-based. A hunch is a question to test, not a finding to broadcast.
- Runs in `nighttime-mode` — quiet, no operator pings unless it finds something urgent.
