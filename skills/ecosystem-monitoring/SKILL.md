---
name: ecosystem-monitoring
description: Watch the market and competitive landscape on a schedule so the operator is never caught off guard — track what's working, what's shifting, and what it means for lead-gen. Use for ongoing market surveillance. Primary skill of the Analytics agent.
---

# ecosystem-monitoring

Keeps a standing watch on the landscape the operator sells into, so change becomes an early
signal instead of a surprise. Runs on a schedule and feeds both the weekly synthesis and the
lead-scoring model.

## What to watch

- **The ICP's world** — where they gather, what they complain about, what they're buying,
  who's winning their attention.
- **Competitors / alternatives** — what similar offers are doing, pricing moves, positioning.
- **Channels** — which sources are producing the best leads lately (feeds `source-collection`
  priorities).
- **Demand signals** — segments heating up or cooling, seasonal shifts.

## How

- Pull from the operator-approved sources on a `cron-management` schedule.
- Track deltas, not just snapshots — "what changed since last week" is the value.
- Log observations to `knowledge-base/analytics/` so they accumulate into a trend, not a
  one-off note.

## Output → the feedback loop

Monitoring isn't the point; acting on it is. Hand findings to:
- `weekly-review` → the operator-facing synthesis.
- `signal-scoring` weights → if a signal is proving more/less predictive, propose a weight
  change (the Analyst applies it via `scoring-weights.yaml`).
- `source-collection` → reprioritize sources that are producing.

## Guardrails

- Signal over noise — track what changes decisions, not everything that moves.
- Surface urgent shifts to the operator promptly; roll routine ones into the weekly review
  rather than pinging constantly.
