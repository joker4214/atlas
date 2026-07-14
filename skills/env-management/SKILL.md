---
name: env-management
description: Manage credentials and secrets safely — load them from the environment, never write them to the KB, a log, a message, or git. Use whenever an agent needs a key or token. Primary skill of the Ops agent.
---

# env-management

Every agent needs keys — STT/TTS, browser sessions, channel tokens. This skill is the one
safe way to handle them: they live in the environment, they're read at use, and they never
touch anything that gets committed, logged, broadcast, or stored in the KB.

## Rules

- **Secrets live in `.env` / the process environment only.** Never in `knowledge-base/`,
  never in a task, never in the activity feed, never in a commit. `.env` is gitignored — keep
  it that way.
- **Read at point of use**, don't copy secrets around. Pass a reference ("use the Deepgram
  key"), not the value, in any inter-agent message.
- **Never log a secret.** Redact tokens in any diagnostic output (`sk-...abcd`).
- **One place per credential.** If a key rotates, it changes in `.env` and everything picks
  it up — no scattered copies.

## What's a secret

API keys, auth tokens, bot tokens, chat/user ids, session cookies, anything that grants
access or identity. When unsure, treat it as one.

## Rotation + hygiene

- Keep `.env.example` current (names only, never values) so a fresh install knows what's
  needed.
- If a secret may have leaked (appeared in a log, a message, a commit), flag it to the
  operator immediately as needing rotation — don't quietly move on.

## Guardrails

- Reading `.env` is fine; printing it is not. This skill's whole job is that a secret is
  never observable outside the process that uses it.
