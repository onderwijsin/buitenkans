# Runtime And Deployment (Agent)

## Nuxt Runtime

- `extends: ['docus']`
- Nitro preset: `cloudflare_module`
- production route rule prerenders `/**`
- `/assets/**` served through blob route
- `/stats` redirects to Plausible dashboard
- temporary Docus Dutch locale patch active:
  - `patches/docus@5.9.0.patch`
  - `pnpm-workspace.yaml` patched dependency entry for `docus@5.9.0`
  - removal trigger tracked in `.agents/context/i18n-patches.md`

## UI Runtime

- Core UI: Nuxt UI
- Single local Inspira/shadcn-style component: `app/components/PatternBackground.vue` +
  `app/composables/pattern-background.ts`
- shadcn-style config: `components.json`

## Cloudflare Bindings

Expected bindings:

- D1: `DB`
- KV: `CACHE`
- R2: `BLOB`

Configured in `nuxt.config.ts` under `nitro.cloudflare.wrangler`.

## Studio And Branching

Studio repository config points to branch `content`.

Automation:

- `content_promote.yml` promotes `content/**` changes to `main`
- `sync_main_to_content.yml` syncs `main` back into `content`
- auto production deploys happen only for content-only pushes on `main`

## AI Assistant

- `assistant.model = 'mistral/mistral-medium'`
- gateway key from `AI_GATEWAY_API_KEY`
- assistant consumes MCP tools from `/mcp` (Docus + `@nuxtjs/mcp-toolkit`)
- custom project MCP tools:
  - `search-knowledge`
  - `list-insights`
  - `recommend-insights`
  - `list-faqs`
- no custom `/api/ai/*` feature set currently present

## Testing State

- no test scripts currently in `package.json`
- `pnpm lint` and `pnpm typecheck` are the active local verification commands
