# Content And Routes (Agent)

## Content Collections

Configured in `content.config.ts`:

- `faqs`: `title`, `description`
- `people`: `name`, `job`, `employer|null`, `avatar|null`

Docus docs pages come from `content/docs/**`.

## Custom Route Pages

- `/` -> `app/pages/index.vue`
- `/docs/inzichten/overzicht` -> cards generated from docs collection
- `/docs/duik-dieper/veelgestelde-vragen` -> FAQ collection list
- `/docs/duik-dieper/klankbordgroep` -> people collection list

## Server Routes

Active files:

- `server/api/_sentry/trigger-error.get.ts`
- `server/routes/assets/[...pathname].get.ts`
- `server/api/content.get.ts`
- `server/api/resources.get.ts`

`content.get.ts` and `resources.get.ts` query collections named `items` and `resources`. Keep these
route collection names aligned with content collection configuration when using them.
