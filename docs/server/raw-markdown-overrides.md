# Raw Markdown Overrides

This guide documents why specific `/raw/...md` routes are overridden, how to extend them, and when
they can be removed.

## Why These Overrides Exist

Nuxt Content + `nuxt-llms` provides a default `/raw/:path.md` endpoint based on markdown body in
`content/**`.

For three pages in this project, frontend rendering does not use the markdown body. It uses Vue
pages that assemble data from collections:

- `/docs/inzichten/overzicht` -> cards from `docs` collection
- `/docs/duik-dieper/klankbordgroep` -> rows from `people` collection
- `/docs/duik-dieper/veelgestelde-vragen` -> rows from `faqs` collection

Without overrides, raw output returns placeholder markdown text and diverges from frontend content.

Frontend implementation note:

- these three Vue routes share `app/composables/useDocsOverridePage.ts` and
  `app/components/DocsOverridePage.vue` for common docs-page bootstrap/shell behavior
- route-specific collection rendering still lives in each page file, and raw handlers must stay in
  sync with that route-specific data logic

## Current Override Routes

- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`

Shared helper:

- `server/utils/raw-markdown.ts`

These routes set `Content-Type: text/markdown; charset=utf-8` and generate markdown from the same
collections as the Vue pages.

## How To Extend

Add a new override when all these are true:

1. The docs route is rendered by a custom Vue page.
2. The markdown file body is placeholder or intentionally not used.
3. `/raw/...md` must mirror frontend data for AI/agent consumers.

Implementation steps:

1. Add a route handler at `server/routes/raw/<docs-path>.md.get.ts`.
2. Import shared helper with `~~/server/utils/raw-markdown`.
3. Query the same collections used by the frontend page.
4. Build markdown sections with stable headings and links.
5. Return via `sendMarkdown(event, markdown)` to keep content-type consistent.
6. Document the new route in:
   - `docs/server/README.md`
   - `docs/content/README.md` (if content-related)
   - `.agents/context/content-and-routes.md`
   - `.agents/patterns/raw-markdown-overrides.md`

## When It Can Be Removed

Remove an override only when raw output and frontend output are naturally equivalent again.

Typical removal scenarios:

1. The page returns to markdown-driven rendering only.
2. The markdown source itself is generated from the same data and no longer placeholder.
3. The custom Vue route is removed and replaced by normal Docus content rendering.

Before removal:

1. Compare frontend page and `/raw/...md` output for the route.
2. Ensure `llms.txt` links still point to valid, equivalent content.
3. Update docs in both `docs/` and `.agents/` to reflect the removal.
