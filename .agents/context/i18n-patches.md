# Docus Patch Inventory (Agent)

Active pnpm patch:

- `patches/docus@5.9.0.patch`
- `pnpm-workspace.yaml` -> `patchedDependencies.docus@5.9.0`

## 1. Dutch Locale Translations

- Patches `i18n/locales/nl.json` with assistant UI strings.
- Removal: upstream PRs #1335 or #1336 merged and released.

## 2. OG Image Font Family

- Adds `fontFamily: 'Poppins'` to `defineOgImage()` in `app/pages/[[lang]]/[...slug].vue` and
  `app/templates/landing.vue`.
- Removal: upstream Docus supports stable OG font config or inherits project fonts.

## 3. MCP Transport (Cloudflare Workers)

- Patches `modules/assistant/runtime/server/api/search.ts`.
- Adds `createSafeFetch()` wrapper:
  - uses `event.fetch` for Nitro internal routing (avoids self-referencing fetch / 522)
  - sets `Accept: application/json, text/event-stream` (avoids 406)
  - converts `Headers` to plain object for Nitro handler compatibility
- Injected into `createMCPClient({ transport: { ..., fetch } })`.
- Removal: upstream Docus uses internal routing for same-origin MCP calls and sets required headers.

## 4. Type Compatibility

- Adds `as any` casts and import fix in `modules/config.ts` and `nuxt.config.ts`.
- Guards `inferSiteURL()` with string type check.
- Removal: upstream Docus releases Nuxt 4 compatible types.

## 5. Sitemap Landing Collection

- Removes landing collection query from `server/routes/sitemap.xml.ts`.
- Removal: upstream Docus handles optional landing collections.

## Human Mirror

- `docs/config/docus-nl-locale-patch.md`
