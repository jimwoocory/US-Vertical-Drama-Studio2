# USVDS2 architecture and invariants

**Version:** foundation draft, 2026-10-09. Nothing in this document signifies a production-ready app.

## Logical modules

| Module | Owns | Does not own |
| --- | --- | --- |
| Intake / Router | user request scope, source evidence, next allowed task | story facts, approval |
| Story Core | immutable revisions, exact story facts, stable identities, provenance | layout or preview caches |
| Creative Engine | interview, directions, rewrite proposals, semantic review requests | canon changes without review |
| Director Bridge | explicit stage inputs and audio/visual/post boundaries | new unapproved story facts |
| Provider Adapters | model capability evidence and request-format validation | making claims of attached assets |
| Delivery | deterministic reading/export projection and manifest | alternative Story Truth |
| Canvas | node/edge layout and changes proposed against revision | direct canonical writes |
| Approval service (future) | verified human identity and scoped digest approvals | AI-issued approval |

## Core rules

1. Every project has one canonical Story Record with immutable `projectId`, `revision`, and content `digest`.
2. Revision fingerprints derive from a deterministic serialization of exact content.
3. A proposal carries the source revision and digest; stale proposals are rejected, not silently rebased.
4. Proposed edits and visual layout edits are different operations.
5. No untrusted AI output can mint authenticated human approval.
6. A review, a creator-authorized draft, a production approval, and a playable media deliverable are separate states.
7. A narrow request stops at its requested output; a failed prerequisite is returned as a blocker, not silently bypassed.
8. Sound: dialogue, atmosphere and effects remain distinct from BGM; no-BGM is a project/request choice, not a universal default.
9. A model capability is verified only with explicit source and date; unverified provider behaviors do not become API-ready claims.
10. All external platform side effects require scoped authorization, test evidence, and rollback.

## Interop plan

Read V9 or V10 artifacts through version-specific importers that produce **draft** records, a provenance map, and an unconverted-fields report. Do not silently promote historical APPROVED labels, or overwrite original projects.

## Repository rollout

Branch/PR review and CI first, then application wiring, then test host installation. Avoid multiple generated skill mirrors with independent editable source. Maintain one owner per contract and a generated distribution manifest per platform.
