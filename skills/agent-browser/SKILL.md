---
name: agent-browser
description: Drive a real browser to navigate profiles, stores, and pages that need interaction or a session — pulling context that plain search can't reach. Read-only navigation by default; any action that submits or sends is approval-gated. Used by the Outreach and Lead Research agents.
---

# agent-browser

Some context lives behind a click, a login, or a JS-rendered page that plain search can't
see — a store's live checkout, a profile, an ad-library detail. This skill drives a real
browser to reach it. It **reads** by default; it never submits a form, sends a message, or
takes an outward action without going through `approvals`.

## Use it for

- Pulling live context on a lead the brief needs (store behavior, profile detail, tech
  fingerprint).
- Verifying a signal that requires seeing the rendered page (does checkout actually work? is
  the ad still running?).
- Navigating a source that requires interaction to enumerate candidates.

## Rules

- **Read-only unless approved.** Navigating, reading, screenshotting = fine. Submitting,
  sending, purchasing, logging actions that notify someone = a gated external action; queue
  it via `approvals`.
- **Respect the site.** Honor robots/automation terms and rate limits (`guardrails-reference`).
  Don't defeat anti-automation measures.
- **Bank what you find** into the lead record with the URL, so it's not re-fetched.

## Guardrails

- Credentials for any logged-in session come from `env-management`, never hardcoded, never
  logged.
- If a page requires an action that crosses a guardrail, stop and surface it — don't push
  through.
