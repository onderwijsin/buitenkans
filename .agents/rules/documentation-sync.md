# Documentation Sync Rule

Human policy companion: `TODO add file ref`.

## Core Policy

- `docs/` is for humans.
- `.agents/` is for agents.
- Active information must exist in both places.

## Scope

Keep both surfaces synchronized for:

- Architecture and workspace boundaries.
- Runtime and deployment behavior.
- Coding/testing conventions.
- Security-sensitive operational behavior.
- Validation workflows and command contracts.

## Required Workflow

1. Update relevant file(s) in `docs/`.
2. Update corresponding file(s) in `.agents/`.
3. Add or fix cross-links between both locations.
4. Verify commands/examples are consistent.

## Mapping Baseline

- `docs/README.md` <-> `.agents/README.md`
- `docs/conventions.md` <-> `.agents/rules/*` + `.agents/patterns/*`
- `docs/monorepo-setup.md` <-> `.agents/context/architecture.md`
- `docs/directus/*.md` <-> `.agents/context/directus-domain.md`
- `docs/nuxt/*.md` <-> `.agents/context/nuxt-security.md`
- `docs/testing.md` <-> `.agents/patterns/testing-and-validation.md`

## PR Review Rule

Treat missing mirror updates as incomplete documentation.
