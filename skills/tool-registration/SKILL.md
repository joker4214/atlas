---
name: tool-registration
description: Register new tools and integrations as they arrive so agents can discover and use them safely — with the right scope and credentials. Use when adding a capability (a new source, channel, or MCP integration). Used by the Ops agent.
---

# tool-registration

As the operation grows, new tools arrive — a new lead source, a CRM integration, a channel,
an MCP server. This skill brings them online cleanly so agents can discover and use them, with
scoped access and no credential leakage.

## Registering a tool

1. **Describe it** — what it does, which agents should use it, what it can and cannot touch.
2. **Scope it** — least privilege. A source tool reads; it doesn't get send rights. A channel
   tool sends only through `approvals`.
3. **Wire credentials via `env-management`** — keys go in `.env`, referenced by name, never
   inlined.
4. **Announce it** via `activity-channel` so the relevant agents know the capability exists
   and how to call it.
5. **Record it** in a tools registry note in the KB (name, purpose, owner agents, scope) so
   the fleet has a single source of truth for what's available.

## Rules

- **New tools inherit the guardrails.** A new send-capable tool is still gated by `approvals`;
  a new source still respects terms and rate limits. Adding a tool never adds an exception.
- Prefer well-scoped MCP integrations over ad-hoc scripts where possible (`mcp-integration`).

## Guardrails

- Don't grant a tool broader access than the job needs. The blast radius of a compromised
  tool is exactly its scope.
- A tool that can act externally is not "ready" until it routes through the approval gate —
  verify that before announcing it.
