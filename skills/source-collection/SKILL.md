---
name: source-collection
description: Find candidate leads from the defined source list and turn them into deduped lead stubs in the knowledge base. Use at the top of the funnel when the goal is to fill the pipeline with new prospects. Used by the Lead Research and Content agents.
---

# source-collection

Fills the top of the funnel. Pulls candidate prospects from the sources we trust, dedupes
them against what we already know, and drops clean **lead stubs** into the knowledge base
for the research + scoring steps to pick up. It gathers; it does not judge (that's
`signal-scoring`) and it does not contact anyone (that's `outreach`).

## Where to look

Read the source list from `knowledge-base/seed/sources.md`. Only pull from sources listed
there — it's the operator-approved surface area. Typical sources for a lead-gen employee:

- Marketplaces / directories that match the ICP (e.g. Shopify/Wix/WordPress store lists).
- Forums and communities where the ICP posts about the problem we solve.
- Ad libraries (who is actively spending — a strong "act now" signal).
- Public job boards / launch feeds / review sites (change = opportunity).

Respect each source's terms of use and rate limits. If a source needs a login or a browser
session, hand that fetch to the `agent-browser` skill. Never scrape anything the source
list doesn't sanction.

## What to produce

For each candidate, write a stub at `knowledge-base/leads/<slug>.md`:

```markdown
---
id: <slug>            # kebab-case, stable
name: "<business or person>"
source: "<which source + url>"
found_at: 2026-07-13
stage: sourced        # sourced -> researched -> scored -> outreach -> replied -> won/lost
score: null
qualification: null
---
# <name>

- **Why surfaced:** one line — the signal that made this worth a look.
- **Raw notes:** links, handles, anything grabbed at collection time.
```

## Dedup — never create the same lead twice

Before writing a stub, check `knowledge-base/leads/` for an existing record by:
1. slug, 2. domain/handle, 3. business name (fuzzy).
If it exists, **append the new signal** to the existing record instead of creating a
duplicate, and note the new sighting. The shared brain means we never redo work — honor
that here.

## Hand-off

When a batch of stubs lands, post one summary line to the activity feed
(`event-logging`): how many new, how many were dupes, which sources. The Lead Research
agent takes it from `stage: sourced`.

## Guardrails

- Quality over volume. A tight, on-ICP list beats a big noisy one — the scorer will just
  sink the noise and waste research time.
- No PII beyond what's publicly posted for business contact. No purchased lists.
