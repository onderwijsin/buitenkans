# Content

This project uses Nuxt Content for both documentation pages and structured YAML data.

## Collections In Use

Defined in [`../../content.config.ts`](../../content.config.ts):

- `faqs` (`content/faqs/**.md`)
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

## Raw Markdown For AI/Agents

Nuxt LLMs exposes `/raw/:path.md` for docs pages.

For the three dynamic Vue-rendered pages above, this project overrides raw output with explicit
server handlers so returned markdown mirrors the rendered page data (instead of placeholder body
text from source markdown):

- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`

Shared formatter/helper logic lives in `server/utils/raw-markdown.ts`.

Detailed lifecycle guidance (why/extend/remove):

- [`../server/raw-markdown-overrides.md`](../server/raw-markdown-overrides.md)
