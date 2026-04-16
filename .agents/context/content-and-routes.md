# Content And Routes (Agent)

## Content Collections

Configured in `content.config.ts`:

- `faqs` (`content/faqs/**.md`): `title`, `description`, `category?`, `audience?`, `tags?`,
  `related?`
- `people` (`content/people/**.yml`): `name`, `job`, `employer|null`, `avatar|null`

Docus docs pages come from `content/docs/**`.

## Custom Route Pages

- `/` -> `app/pages/index.vue`
- `/docs/inzichten/overzicht` -> cards generated from docs collection
- `/docs/duik-dieper/veelgestelde-vragen` -> FAQ collection list
- `/docs/duik-dieper/klankbordgroep` -> people collection list

Shared override-page abstractions:

- `app/composables/useDocsOverridePage.ts`
  - shared docs page loading + SEO/OG + headline/breadcrumbs + raw prerender registration
- `app/components/DocsOverridePage.vue`
  - shared page shell/header-links pattern used by the three custom docs routes

## Raw Markdown Overrides

`nuxt-llms` provides `/raw/:path.md`, but these three dynamic pages are overridden so markdown
output reflects rendered collection data:

- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`

Shared logic:

- `server/utils/raw-markdown.ts`
- extension/removal playbook: `.agents/patterns/raw-markdown-overrides.md`

## Custom MCP Tools

Custom assistant tools in `server/mcp/tools/*`:

- `search-knowledge` — unified search across `docs`, `faqs`, and `people` with optional FAQ metadata
  filters
- `list-insights` — structured list of all insight pages
- `recommend-insights` — objective-driven recommendations for which insights to read first
- `list-faqs` — FAQ listing with optional query + metadata filtering (`category`, `audience`,
  `tags`)
- all tools use timeout + fallback guards to avoid long-running/stalled MCP responses

Consumed by the Docus assistant runtime through MCP.

## Server Routes

Active files:

- `server/api/_sentry/trigger-error.get.ts`
- `server/routes/assets/[...pathname].get.ts`
- `server/api/content.get.ts`
- `server/api/resources.get.ts`
- `server/mcp/tools/search-knowledge.ts`
- `server/mcp/tools/list-insights.ts`
- `server/mcp/tools/recommend-insights.ts`
- `server/mcp/tools/list-faqs.ts`
- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`

`content.get.ts` and `resources.get.ts` both query the `docs` collection:

- `content.get.ts`: all markdown docs pages except `.navigation`.
- `resources.get.ts`: markdown docs pages under `/docs/duik-dieper/**` except `.navigation`.
