# Regression gates: known failure modes to eliminate

These are release gates, not feature claims.

## Routing

- An outline-only request never proceeds to episode scripts, video, or prompts.
- A prompt-only request preserves story facts and does not regenerate the Story Bible.
- Existing scripts may be reviewed or adapted without forcing a new-idea interview.
- Missing media credentials, incompatible model capabilities and user login must be reported before starting costly research or generation.

## Story/approval

- Stable IDs for characters, relationships, revelations and scene requirements.
- AI changes are proposals tied to exact base revision and digest.
- Stale changes fail. Human-approved revisions never change in place.
- AI self-review is not independent review.
- Human identity must be verified outside model text; this is currently NOT IMPLEMENTED.
- Old story versions do not silently confer approval to new versions.

## Director and video

- Spoken lines, voiceover/OS, silent performance and visible on-screen action must be separate fields.
- Exact titles, timer graphics and viewer-only clues must be allocated explicitly rather than assumed generatable.
- Audio and BGM are not the same; no-BGM must not erase ambience, dialogue or SFX.
- Segment time intervals must not overlap or reverse, and each required segment needs an actionable visible beat.
- Model task modes (generation, reference, edit, extend, first frame) must be individually validated.
- Claims that images/videos are uploaded or attached require executor evidence.

## Distribution, UI and output

- A static HTML reading document is not an interactive persistent Story Canvas.
- DOCX and HTML are derived from the same exact canonical revision and reviewed together.
- Plugin package version, actual installed version and active UI runtime are separately verified.
- Zero new baseline test failures, documented old behavior, real host smoke tests, versioned artifact manifests and rollback procedures.

## Evidence

Use controlled projects for: a one-line original idea; an existing outline; an existing script needing storyboard only; an existing shot needing prompt-only work; and a complete approved-story fixture (only when authenticated approval exists).

**Do not claim an E2E media test without actual outputs and records.**
