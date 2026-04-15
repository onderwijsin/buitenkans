# Raw Markdown Overrides (Agent Pattern)

Use this pattern when `/raw/:path.md` must match a custom Vue-rendered docs page.

## Why

Default `nuxt-llms` raw output is generated from markdown body in `content/**`.

If a docs page renders collection-driven Vue content instead of markdown body, default raw output
can become placeholder text and drift from frontend behavior.

## Active Overrides

- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`
- shared helper: `server/utils/raw-markdown.ts`

## When To Add A New Override

Add one only if all conditions hold:

1. Route is a custom Vue docs page.
2. Markdown body is not the real rendered content.
3. AI/agent consumers depend on `/raw/...md` mirroring frontend output.

## Implementation Contract

1. Place handler at `server/routes/raw/<docs-path>.md.get.ts`.
2. Import helper via `~~/server/utils/raw-markdown`.
3. Query same collections used by the frontend route.
4. Keep heading structure deterministic.
5. Return with `sendMarkdown(event, markdown)` for consistent markdown content-type.
6. Update mirrors:
   - `docs/server/README.md`
   - `docs/server/raw-markdown-overrides.md`
   - `docs/content/README.md` when content-facing
   - `.agents/context/content-and-routes.md`

## Removal Contract

Remove override only when default raw endpoint and frontend output are equivalent again.

Allowed removal scenarios:

1. Route is fully markdown-driven.
2. Markdown source is generated from same dynamic data and is no longer placeholder.
3. Custom Vue route is removed.

Before removal:

1. Compare rendered page vs `/raw/...md`.
2. Check `llms.txt` links still resolve to equivalent content.
3. Remove route file and sync docs mirrors in both `docs/` and `.agents/`.
