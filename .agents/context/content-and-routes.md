# Content And Routes (Agent)

## Content Collections

Configured in `content.config.ts`:

- `faqs` (`content/faqs/**.md`): `title`, `description`
- `people` (`content/people/**.yml`): `name`, `job`, `employer|null`, `avatar|null`

Docus docs pages come from `content/docs/**`.

## Custom Route Pages

- `/` -> `app/pages/index.vue`
- `/docs/inzichten/overzicht` -> cards generated from docs collection
- `/docs/duik-dieper/veelgestelde-vragen` -> FAQ collection list
- `/docs/duik-dieper/klankbordgroep` -> people collection list

## Raw Markdown Overrides

`nuxt-llms` provides `/raw/:path.md`, but these three dynamic pages are overridden so markdown
output reflects rendered collection data:

- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`

Shared logic:

- `server/utils/raw-markdown.ts`
- extension/removal playbook: `.agents/patterns/raw-markdown-overrides.md`

## Server Routes

Active files:

- `server/api/_sentry/trigger-error.get.ts`
- `server/routes/assets/[...pathname].get.ts`
- `server/api/content.get.ts`
- `server/api/resources.get.ts`
- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`

`content.get.ts` and `resources.get.ts` query collections named `items` and `resources`. Keep these
route collection names aligned with content collection configuration when using them.
