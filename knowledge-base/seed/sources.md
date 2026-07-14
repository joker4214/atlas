# Sources — where Atlas looks for leads

> The `source-collection` skill only pulls from sources listed here — this is the
> operator-approved surface area. Add/remove to control where the fleet hunts. Respect each
> source's terms and rate limits (`guardrails-reference`).

## Active sources

| Source | Type | What to look for | Notes / limits |
|---|---|---|---|
| [Shopify/Wix community forums] | forum | owners posting about low sales / needing help | public posts only |
| [Meta/TikTok ad libraries] | ad library | stores actively spending (act-now signal) | read-only |
| [Store directories / marketplaces] | directory | ICP-matching stores | terms-permitting |
| [Relevant subreddits / groups] | community | people describing the exact pain | no spam, no scraping PII |
| [Review sites / launch feeds] | signal | new launches, complaints, changes | dated signals only |

## Inbound sources (leads that come to us)

| Source | How it arrives | Handling |
|---|---|---|
| [Website contact form] | form → inbox | score like any lead; don't skip qualification |
| [Content replies / DMs] | social | route through Outreach, gated |

## Priority

The Analytics agent reprioritizes these based on which are actually producing leads that move
(`ecosystem-monitoring` → `weekly-review`). Check its notes before a big sourcing push.

## Off-limits

- No purchased lists. No scraping personal/sensitive data. No sources that require defeating
  anti-automation measures. When unsure, leave it off this list.
