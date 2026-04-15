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
- [`./docus-nl-locale-patch.md`](./docus-nl-locale-patch.md)
  - temporary Dutch locale patch for Docus via `pnpm patch` (remove after upstream merge)
- [`../../patches/docus@5.9.0.patch`](../../patches/docus@5.9.0.patch)
  - active `pnpm patch` with Docus typecheck compatibility fixes and OG image font-family override
- [`../../shared/types/docus-types-compat.d.ts`](../../shared/types/docus-types-compat.d.ts)
  - temporary Nuxt schema compatibility shim for `RuntimeConfig` typing
- [`../../app/components/OgImage/Docs.takumi.vue`](../../app/components/OgImage/Docs.takumi.vue)
  - local override for Docus docs OG template (explicit `Poppins` family)
- [`../../app/components/OgImage/Landing.takumi.vue`](../../app/components/OgImage/Landing.takumi.vue)
  - local override for Docus landing OG template (explicit `Poppins` family)

## Runtime Notes

- Keep secrets in environment variables and `runtimeConfig`.
- Avoid hardcoding secrets in `config/*` or app source files.
- Treat `MODE` as the source for environment behavior (`dev`, `preview`, `prod`).

## Typecheck Compatibility Notes

- Current stack (`Nuxt 4` + `Docus 5.9`) needs a temporary compatibility shim in
  `shared/types/docus-types-compat.d.ts` to avoid false-positive `RuntimeConfig` typing failures.
- Keep this shim narrow and typed (no broad `any` usage in app source).
- App config UI overrides in `app/app.config.ts` are assigned through a variable (`uiConfig`) to
  avoid excess-property type errors from generated schema narrowing.
- `app/app.config.ts` intentionally keeps `github: false` at runtime to disable Docus GitHub UI
  affordances; a boundary cast is used only to satisfy current generated app-config typing.
- Remove the shim once upstream Docus/Nuxt typing is fixed and `pnpm typecheck` passes without it.

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
- Dutch locale pnpm patch is active; see `docus-nl-locale-patch.md` for lifecycle/removal rules.

## OG Image Font Setup

- Custom OG font is `Poppins` (loaded through `@nuxt/fonts` with `global: true` in
  `nuxt.config.ts`).
- Docus/Nuxt OG image rendering does not consistently apply custom fonts unless font family is
  explicit.
- Active safeguards:
  - local OG components set `style="font-family: 'Poppins', sans-serif;"`
  - page-level `defineOgImage(..., { fontFamily: 'Poppins' })` is set on custom Vue docs pages
  - Docus base docs/landing pages are patched in `patches/docus@5.9.0.patch` to set
    `fontFamily: 'Poppins'`
- Remove the Docus patch part only when upstream Docus exposes a stable OG font config path or the
  layer starts inheriting project fonts without explicit `fontFamily`.
