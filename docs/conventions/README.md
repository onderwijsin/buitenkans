# Conventions

Practical conventions for contributors.

## Scope

- Keep behavior changes intentional and explicit.
- Preserve Cloudflare edge/runtime compatibility.
- Prefer focused changes over broad rewrites.

## Architecture Conventions

1. Keep UI concerns in components and layouts.
2. Keep reusable behavior in composables.
3. Keep API boundary handlers in `server/api/*`.
4. Keep helper logic in `server/utils/*`.
5. Validate boundary inputs with Zod where applicable.

## UI Conventions

1. Nuxt UI is the core UI library.
2. This project includes one local component derived from Inspira/shadcn patterns:
   - `app/components/PatternBackground.vue`
   - `app/composables/pattern-background.ts`
3. Keep shadcn-style component config aligned in `components.json`.
4. Do not introduce additional Inspira/shadcn-derived components unless explicitly requested.

## Nuxt Conventions

1. Use Nuxt auto-imports in runtime files.
2. Keep route/page behavior colocated in `app/pages` and `app/layouts`.
3. Reuse app/runtime config instead of scattering literals.

## Content Conventions

1. Treat `content/` as editorial source of truth.
2. Keep collection schema changes backward-compatible unless requested.
3. Update both human docs and agent docs when content contracts change.

## Docs Conventions

1. `docs/` is human-facing.
2. `.agents/` is agent-facing.
3. Active information must be present in both.
4. Do not edit `.agents/skills/**` unless explicitly requested.

## Quality Gates

Run for meaningful changes:

```bash
pnpm lint
pnpm typecheck
```

Use Conventional Commits and semantic PR titles.
