---
name: web-research
description: Fan-out web search and synthesis — gather from multiple sources, cross-check, and return a sourced answer, not a single-page guess. Use whenever a task needs external facts. Used by the Lead Research, Content, and Analytics agents.
---

# web-research

The fleet's hands for finding things out. Runs multiple searches, reads across sources,
cross-checks, and returns a synthesized, **sourced** answer. Powers `brief-generation`,
`autoresearch`, and `ecosystem-monitoring`.

## How to research well

1. **Decompose the question** into the specific facts you need, then search each.
2. **Fan out** — several queries and sources, not one. A single page is a lead, not an
   answer.
3. **Cross-check** anything that matters. Two independent sources beat one confident one.
4. **Synthesize** — return the answer plus the evidence, with links. Note confidence and
   any conflicts you found.

## Output

```
Answer: <the synthesized finding>
Confidence: high | medium | low
Evidence:
  - <source + link + the specific fact it supports>
Gaps: <what you couldn't confirm>
```

## Rules

- **Cite everything.** An unsourced claim is a hypothesis. Downstream skills (scoring, comms)
  will treat your output as fact — so only assert what you can back.
- Respect source terms and rate limits. For anything needing a logged-in session or page
  interaction, hand off to `agent-browser`.
- Prefer primary sources (the store's own site, the ad library, the filing) over commentary.

## Guardrails

- Don't fabricate to fill a gap — report the gap. "Unknown" is a valid, useful answer.
- Time-box deep dives; return what you have with a confidence level rather than spinning.
