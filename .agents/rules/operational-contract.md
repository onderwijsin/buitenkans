# Operational Contract

Primary source: `AGENTS.md`.

## Critical Rules (MUST)

- Do not introduce breaking UX or data-shape changes without explicit request.
- Keep edge/runtime compatibility intact.
- Do not add dependencies unless explicitly asked.
- Preserve existing naming and file contracts unless explicitly requested.
- Keep docs synchronized in both `docs/` (humans) and `.agents/` (agents).
- Keep test files path-aligned with source files.
- Do not change pinned versions of `typescript`, `eslint` without explicit approval.

## Working Defaults (SHOULD)

- Keep presentational concerns in Nuxt components and reusable logic in composables.
- Keep Nuxt route handlers in `server/api/*` and helpers in `server/utils/*`.
- Use Zod for boundary validation.
- Prefer small, scoped changes.
- Add or update tests for touched runtime logic.

## Definition of Done Checklist

1. Relevant lint/typecheck/test/build checks pass for touched scope.
2. Test path and coverage rules remain aligned with conventions.
3. User-facing data contracts remain backward compatible unless explicitly changed.
4. Non-obvious behavior or architecture changes are documented in both `docs/` and `.agents/`.

## Rule Priority

1. User-facing data contracts and persisted-state semantics.
2. Runtime/edge compatibility and deployment constraints.
3. Correctness and safety in high-risk modules.
4. Existing architecture patterns and module boundaries.
5. Style and naming conventions.
