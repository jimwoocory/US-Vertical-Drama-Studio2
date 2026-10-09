# US Vertical Drama Studio 2 (USVDS2)

A clean-room rebuild of USVDS: one intent router, one canonical story record, independently reviewable change proposals, and adapters for downstream creative production.

> **Status: foundation / not production-ready.** This repository is being rebuilt incrementally. A passing unit test does not prove creator quality, model generation, ChatGPT plugin availability, or human identity verification. Production approval remains disabled until an authenticated approval service is implemented and verified.

## Product boundaries

- **One entry point:** route based on user intent and provided materials, not a fixed wizard.
- **One Story Truth:** immutable revisions; proposals are never automatically promoted into canon.
- **Human control:** machine review and AI recommendations cannot authorize production.
- **Director handoff:** distinguish story facts, spoken dialogue, voiceover/OS, unspoken performance, visual evidence, sound, and postproduction.
- **Provider profiles:** capabilities are explicit and dated; unknown means unverified, not silently supported.
- **Creative UI later:** interview and Story Canvas are projections/sidecars, not alternate canon.

## Milestones

1. **Foundation:** versioned domain contracts, route boundary tests, immutable story revisions, and change proposals.
2. **Creative core:** idea interviews, alternative conflict engines, source adaptations, Story Bible, independent review.
3. **Direction and delivery:** bilingual screenplay, assets, storyboard and model-specific outputs with reference integrity.
4. **Visual editor:** MCP App Story Canvas with durable user/project storage.
5. **Production readiness:** authenticated human approval, real host integration, installer/runtime verification, media E2E and rollback.

## Development

Node.js 22+.

```sh
npm test
```

## Safety and compatibility

The old V9/V10/V11 repositories and uncommitted worktrees must not be overwritten by this rebuild. Data migration will be explicit, source-traceable and reversible. Approval status from older files must not be imported as authenticated approval.

See `docs/ARCHITECTURE.md`, `docs/REGRESSION-GATES.md`.

License and dependency policy to be confirmed before any third-party code is imported.
