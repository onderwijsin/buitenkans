# Content

This project uses Nuxt Content for both documentation pages and structured YAML data.

## Collections In Use

Defined in [`../../content.config.ts`](../../content.config.ts):

- `faqs` (`content/faqs/**.yml`)
- `people` (`content/people/**.yml`)

Docus page content is sourced from `content/docs/**` (docs collection managed by Docus layer).

## Editorial Workflow

- Nuxt Studio is enabled at `/studio`
- repository integration points Studio to branch `content`
- content promotion to `main` is automated and restricted to `content/**`

See [`../ci-cd/README.md`](../ci-cd/README.md) for exact branch automation behavior.

## Data Shape Contracts

`faqs` fields:

- `title` (string)
- `description` (string)

`people` fields:

- `name` (string)
- `job` (string)
- `employer` (nullable string)
- `avatar` (nullable string)

Keep these stable unless a coordinated schema + UI change is requested.

## Custom Docs Pages Using Data Collections

- `/docs/duik-dieper/veelgestelde-vragen` reads `faqs`
- `/docs/duik-dieper/klankbordgroep` reads `people`
- `/docs/inzichten/overzicht` builds cards from docs markdown entries

These pages are implemented in `app/pages/docs/**`.
