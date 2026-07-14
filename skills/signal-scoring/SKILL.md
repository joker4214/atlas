---
name: signal-scoring
description: Score and rank a lead against weighted criteria (fit, signal strength, ability-to-act) so only the real ones reach the human. Use whenever a new lead is sourced or an existing lead's situation changes. Shared by the Lead Research and Analytics agents.
---

# signal-scoring

The point of the whole system: the human should only spend time on leads that are
actually worth it. This skill turns a raw lead into a **0–100 score, a qualification
verdict, and a routing decision** — automatically, every time.

## The model

Score three dimensions, then combine them with the weights in
`knowledge-base/seed/scoring-weights.yaml`. Never hardcode weights here — always read
that file so the Analytics agent can tune them from real outcomes.

| Dimension | Question it answers | Typical sub-signals |
|---|---|---|
| **Fit** | Are they our ICP? | industry/platform match, size band, geography, tech stack |
| **Signal strength** | Is there a reason to act *now*? | active ad spend, recent launch/redesign, hiring, poor-converting site, public complaint |
| **Ability to act** | Can they actually buy? | decision-maker reachable, budget evidence, no blocking constraint |

```
score = 100 * (w_fit*fit + w_signal*signal + w_act*act)   # each sub-score in 0..1
```

Read the weights:

```yaml
# knowledge-base/seed/scoring-weights.yaml (example)
weights: { fit: 0.35, signal: 0.45, act: 0.20 }
qualified_threshold: 70
borderline_band: [55, 70]
```

## Qualification (this is not the same as "ready")

- **Pain-qualified** — they clearly have the problem we solve. Necessary, not sufficient.
- **Ready** — pain-qualified **and** able to act (reachable decision-maker + budget signal).
- Treat them differently. A pain-qualified-but-not-ready lead goes to nurture, not outreach.

Set `qualification: cold | pain-qualified | ready` on the lead.

## Routing verdict

- `score >= qualified_threshold` **and** `ready` → `route: outreach`
- score in `borderline_band` → `route: human-review` (flag to the operator by voice — do
  **not** guess; hand the judgment call up)
- below the band → `route: nurture` (Content agent territory) or `route: drop`

## How to run it

1. Load the lead record `knowledge-base/leads/<id>.md` and `scoring-weights.yaml`.
2. Score each dimension from the evidence in the brief. **Cite the evidence** for every
   sub-score in one line — no unsupported points.
3. Write the result back into the lead's frontmatter:

```markdown
---
id: posh-pets
score: 82
fit: 0.80
signal: 0.95
act: 0.55
qualification: ready
route: outreach
scored_at: 2026-07-13
rationale: "Active Meta ad spend + 0 reported sales (signal 0.95); Shopify pet-accessories = core ICP (fit 0.80); owner reachable via store contact, budget unclear (act 0.55)."
---
```

4. Append a line to the activity feed (`event-logging`) and, if `route: human-review`,
   surface it to the operator via `approvals` / the morning briefing.

## Guardrails

- Every score must trace to evidence in the brief. If the brief is thin, return
  `route: needs-research` instead of inventing signal.
- Do not let a single flashy signal override poor fit — the weights exist for a reason.
- Scores are advisory for borderline cases; the human always breaks ties.
