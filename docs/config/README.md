# Config

Project configuration is split across static config files, runtime env vars, and Nuxt runtime
config.

## Main Files

- [`../../nuxt.config.ts`](../../nuxt.config.ts)
  - modules
  - Cloudflare Nitro preset
  - route rules
  - runtime/public config shape
  - assistant model selection
- [`../../config/constants.ts`](../../config/constants.ts)
  - stable constants and behavior knobs
- [`../../config/head.ts`](../../config/head.ts)
  - app head/meta defaults
- [`../../config/identity.ts`](../../config/identity.ts)
  - site identity export
- [`../../app/app.config.ts`](../../app/app.config.ts)
  - Docus/UI app-level config (assistant FAQ prompts, header/socials, UI tuning)
- [`../../content.config.ts`](../../content.config.ts)
  - Nuxt Content data collection schemas
- [`../../components.json`](../../components.json)
  - shadcn-vue style component config used for the local Inspira-style component setup

## Runtime Notes

- Keep secrets in environment variables and `runtimeConfig`.
- Avoid hardcoding secrets in `config/*` or app source files.
- Treat `MODE` as the source for environment behavior (`dev`, `preview`, `prod`).

## Cloudflare-Specific Knobs

`nuxt.config.ts` contains Cloudflare deployment details under `nitro.cloudflare.wrangler`, including
bindings for:

- D1 (`DB`)
- KV (`CACHE`)
- R2 (`BLOB`)

Update these together with CI/CD env settings.

## Assistant-Specific Knob

- `assistant.model` is currently `mistral/mistral-medium`.
- Keep this in sync with project AI policy and environment setup.
