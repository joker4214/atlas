---
name: research-quality-review
description: Check a lead brief before it lands — verify every signal is sourced, the fit call is honest, and there's no invented detail. Use on high-stakes briefs before scoring or outreach. Used by the Lead Research agent.
---

# research-quality-review

A brief that looks confident but is half-invented is worse than no brief — it mis-scores
and produces outreach that gets caught being wrong. This skill is the gate before a brief
is trusted.

## Checklist

Run against a `stage: researched` brief:

1. **Sourcing** — does every claim in "Signals worth acting on now" and "Business shape"
   have a link or a clearly-labeled inference? Flag any bare assertion.
2. **Fit honesty** — is the ICP match real, or stretched to justify keeping the lead? Say
   so plainly.
3. **Recency** — are the signals current? A redesign from 2 years ago is not an "act now"
   signal. Check dates.
4. **Contactability** — is the stated decision-maker/contact path actually verified, or
   assumed?
5. **The angle** — does it hold up, or is it a generic pitch dressed as insight?

## Output

- If it passes: set `qa: passed` in the frontmatter and let it proceed to scoring.
- If it fails: set `qa: needs-work`, list the specific gaps as a checklist in the brief,
  and hand it back to `brief-generation`. Do not let a failing brief reach the scorer.

## Guardrails

- Be the skeptic. It is cheaper to reject a brief than to have the operator send outreach
  built on a wrong fact.
- Never "fix" a sourcing gap by asserting the claim yourself — send it back for real
  sourcing.
