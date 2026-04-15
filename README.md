![Buitenkans handreiking](./public/Regional%20Site%20Menu%20Interactive%20App.png)

<p>
  <a href="https://nuxt.com/"><img src="https://img.shields.io/badge/Nuxt-4-28CF8D?logo=nuxt.js&logoColor=white" alt="Nuxt"></a>
  <a href="https://docus.dev/"><img src="https://img.shields.io/badge/Docus-Layer-0EA5E9" alt="Docus"></a>
  <a href="https://content.nuxt.com/"><img src="https://img.shields.io/badge/Nuxt_Content-Docs_+_Data-22C55E" alt="Nuxt Content"></a>
  <a href="https://ui.nuxt.com/"><img src="https://img.shields.io/badge/Nuxt_UI-v4-7C3AED" alt="Nuxt UI"></a>
  <a href="https://www.cloudflare.com/"><img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare"></a>
</p>

# Buitenkans

Buitenkans is a Dutch project focused on strengthening pathways into school leadership in primary
education, with specific attention to side-entry (`zij-instroom`) and progression routes
(`doorstroom`).

This repository contains the digital handout that publishes project insights, practical guidance,
background material, FAQs, and contributor context for school boards, training partners, and
schools.

## Table Of Contents

- [Project Context](#project-context)
- [What This App Provides](#what-this-app-provides)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [UI Stack Note](#ui-stack-note)
- [Repository Structure](#repository-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Content And Studio Workflow](#content-and-studio-workflow)
- [AI Assistant](#ai-assistant)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Documentation](#documentation)

## Project Context

Buitenkans is connected to Onderwijsregio Oost-Nederland and Stichting Onderwijs in. The initiative
explores how new school leaders can enter and develop successfully in primary education, and what
this requires from school organizations and regional collaboration.

For full non-technical project context, see [`ABOUT.md`](./ABOUT.md).

## What This App Provides

- a Docus-based guidance site in Dutch
- curated insights and long-form background pages
- structured FAQ and people collections
- editorial workflow through Nuxt Studio
- integrated AI assistant for on-site help

## Architecture

- `nuxt.config.ts` extends `docus`
- main content pages live in `content/docs/**`
- additional data collections in `content/faqs/**` and `content/people/**`
- custom route pages:
  - `/` (`app/pages/index.vue`)
  - `/docs/inzichten/overzicht`
  - `/docs/duik-dieper/veelgestelde-vragen`
  - `/docs/duik-dieper/klankbordgroep`
- server routes:
  - `GET /api/_sentry/trigger-error`
  - `GET /assets/**` (R2 blob serving)

## Tech Stack

- Nuxt 4
- Docus layer
- Nuxt Content
- Nuxt UI v4 + Tailwind CSS v4
- Nuxt Studio
- NuxtHub (`@nuxthub/core`)
- Cloudflare Workers (Nitro preset `cloudflare_module`)
- Sentry (`@sentry/nuxt`)
- Plausible (`@nuxtjs/plausible`)
- VueUse (`@vueuse/nuxt`)

## UI Stack Note

Primary UI library is **Nuxt UI**.

This project also includes one local component inspired by Inspira UI:

- [`app/components/ui/pattern-background/PatternBackground.vue`](./app/components/ui/pattern-background/PatternBackground.vue)
- helper/types:
  [`app/components/ui/pattern-background/index.ts`](./app/components/ui/pattern-background/index.ts)

That component uses `@inspira-ui/plugins` helpers and follows the shadcn-vue style config in:

- [`components.json`](./components.json)

## Repository Structure

- `app/` app pages, layouts, components, composables
- `content/` markdown docs + YAML data collections (`faqs`, `people`)
- `config/` static app constants, head, identity
- `server/` API/routes/plugins utilities
- `shared/types/` shared TS declarations
- `docs/` human documentation
- `.agents/` agent documentation (`context`, `rules`, `patterns`)

## Local Development

Requirements:

- Node `24` (see `.nvmrc`)
- pnpm `10+`

Setup:

```bash
pnpm install
cp .example.env .env
cp example.wrangler.jsonc wrangler.jsonc
```

Run:

```bash
pnpm dev
```

Build/preview:

```bash
pnpm build
pnpm preview
```

Quality checks:

```bash
pnpm lint
pnpm typecheck
```

## Environment Variables

Use `.example.env` as the source of truth.

Tooling toggles:

- `DISABLE_PRE_COMMIT_FORMAT`
- `DISABLE_PRE_COMMIT_LINT`
- `DISABLE_PRE_PUSH_TYPECHECK`
- `DISABLE_PRE_PUSH_LINT`

Core runtime:

- `DEBUG`
- `MODE` (`dev | preview | prod`)
- `APP_URL`
- `PROD_URL`
- `API_TOKEN`

AI assistant:

- `AI_GATEWAY_API_KEY`

Cloudflare:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_CACHE_NAMESPACE_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_R2_BUCKET`
- `WORKER_NAME`

Storage (R2/S3 compatible):

- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_ENDPOINT`
- `S3_BUCKET`
- `S3_PUBLIC_URL`

Analytics:

- `PLAUSIBLE_DOMAIN`
- `DISABLE_TRACKING`

Nuxt Studio auth:

- `STUDIO_GITHUB_CLIENT_ID`
- `STUDIO_GITHUB_CLIENT_SECRET`

Sentry:

- `SENTRY_ENABLED`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_PROJECT`
- `SENTRY_ORG`
- `SENTRY_DSN`
- `SENTRY_UPLOAD_SOURCE_MAPS`

## Content And Studio Workflow

- Editors use Nuxt Studio at `/studio`
- Studio writes to branch `content`
- `content_promote.yml` only promotes `content/**` changes to `main`
- `sync_main_to_content.yml` syncs `main` back into `content`

This keeps content editing fast while preserving `main` as the production source branch.

## AI Assistant

The site uses the Docus/Nuxt UI assistant integration.

Current config:

- `nuxt.config.ts` -> `assistant.model = 'mistral/mistral-medium'`
- `.example.env` includes `AI_GATEWAY_API_KEY`
- `app/app.config.ts` defines assistant FAQ starter questions

Operational note from project policy:

- The team uses AI Gateway with project-owned Mistral keys and treats the gateway setup as
  ZDR-aligned.

## Deployment

Deployment target is Cloudflare Workers through Nitro.

Key runtime/bindings:

- D1 binding: `DB`
- KV binding: `CACHE`
- R2 binding: `BLOB`

Nuxt config uses `nitro.cloudflare.wrangler` to inject deployment settings and bindings.

## CI/CD

Workflows are in `.github/workflows`.

Main flows:

- `pull_request.yml`: code quality + preview deployment
- `content_promote.yml`: content branch to main (content-only)
- `sync_main_to_content.yml`: keep content branch aligned
- `deploy.yml` + `deploy_worker.yml`: release/deploy orchestration
- `lint_pr_title.yml`: semantic PR title check
- `gitleaks.yml`: secret scanning

Automatic production deploys are restricted to **content-only** pushes on `main`. For code changes,
use manual workflow dispatch.

## Documentation

Human docs:

- [`docs/README.md`](./docs/README.md)

Agent docs:

- [`.agents/README.md`](./.agents/README.md)

Collaboration contract:

- [`AGENTS.md`](./AGENTS.md)

## License

[MIT](./LICENSE)
