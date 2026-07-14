---
name: weekly-review
description: Roll the week's numbers and market observations into one synthesis that says what should change next week — including retuning the lead-scoring weights from real outcomes. Runs weekly. Primary skill of the Analytics agent.
---

# weekly-review

Once a week, turn everything the fleet saw into a decision: what's working, what's not, and
what to change. This is the loop that makes lead-gen improve over time instead of running the
same play forever.

## What to synthesize

- **Pipeline numbers** — leads sourced, scored, routed, contacted, replied, won/lost. Where
  did the funnel leak?
- **Scoring accuracy** — did high-scored leads actually convert better than low-scored ones?
  This is the key feedback: it tells you whether the weights are right.
- **Channel performance** — which sources produced the leads that moved.
- **Market shifts** — the week's `ecosystem-monitoring` observations that matter.

## The output

```markdown
# Weekly review — week of 2026-07-13
## What worked
- <with numbers>
## What didn't
- <with numbers>
## Scoring calibration
- High-score leads (70+) converted at X%; mid at Y%. → proposal: raise w_signal from 0.45→0.50
  because active-ad-spend leads over-performed.
## Change next week
- <the 1–3 concrete changes, each with an owner>
```

## Close the loop — actually tune the model

If the calibration says the weights are off, **update
`knowledge-base/seed/scoring-weights.yaml`** (this is the operator-sanctioned exception where
the Analyst may edit a seed file — log it and note it in the review for operator visibility),
then broadcast via `activity-channel` so Research re-scores the open queue against the new
weights. A review that changes nothing is a report nobody reads.

## Delivery

Bank in `knowledge-base/analytics/`, and surface the headline + the 1–3 changes to the
operator (by voice, or folded into a Monday morning briefing).

## Guardrails

- Numbers, not vibes. Every claim ties to a count from the KB.
- Change weights conservatively — small adjustments backed by real conversion data, not
  overfit to one good week.
