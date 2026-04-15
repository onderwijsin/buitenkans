# Docus Patch Reference

This repository applies a `pnpm patch` to Docus 5.9.0 containing multiple surgical fixes.

- `patches/docus@5.9.0.patch`
- `pnpm-workspace.yaml` -> `patchedDependencies.docus@5.9.0`

## Patch Inventory

The patch contains five independent fix areas:

| #   | Area                                                              | Files patched                                                   | Why                                                                         |
| --- | ----------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | [Dutch locale](#1-dutch-locale-translations)                      | `i18n/locales/nl.json`                                          | Missing/outdated assistant UI labels                                        |
| 2   | [OG font family](#2-og-image-font-family)                         | `app/pages/[[lang]]/[...slug].vue`, `app/templates/landing.vue` | Docus OG images render fallback font without explicit `fontFamily`          |
| 3   | [MCP transport (Cloudflare)](#3-mcp-transport-cloudflare-workers) | `modules/assistant/runtime/server/api/search.ts`                | Self-referencing fetch and missing Accept header break assistant on Workers |
| 4   | [Type compatibility](#4-type-compatibility)                       | `modules/config.ts`, `nuxt.config.ts`                           | Nuxt 4 + Docus 5.9 type mismatches                                          |
| 5   | [Sitemap landing fix](#5-sitemap-landing-collection)              | `server/routes/sitemap.xml.ts`                                  | Missing landing collection when `app/pages/index.vue` exists                |

## 1. Dutch Locale Translations

### Problem

Docus 5.9.0 ships incomplete Dutch translations for assistant UI labels ("Vraag AI", "Stel een
vraag...", loading states, etc.).

### What the patch does

Adds the `assistant` key block to `i18n/locales/nl.json` with all required Dutch strings.

### Why not a runtime override?

Docus already provides `$localeMessages` internally. Attempting to redefine it via a Nuxt plugin
causes `Cannot redefine property: $localeMessages` at runtime.

### Removal criteria

Remove once either upstream PR is merged and included in the pinned Docus version:

- https://github.com/nuxt-content/docus/pull/1335
- https://github.com/nuxt-content/docus/pull/1336

## 2. OG Image Font Family

### Problem

Docus base docs and landing OG image templates do not pass `fontFamily` to `defineOgImage`, causing
fallback font rendering even though `@nuxt/fonts` provides Poppins globally.

### What the patch does

Adds `fontFamily: 'Poppins'` to `defineOgImage()` calls in Docus `[...slug].vue` and `landing.vue`.

### Removal criteria

Remove when upstream Docus exposes a stable OG font config path or inherits project fonts without
explicit `fontFamily`.

## 3. MCP Transport (Cloudflare Workers)

### Problem

The Docus assistant handler (`modules/assistant/runtime/server/api/search.ts`) creates an MCP HTTP
client that makes a network fetch to the `/mcp` endpoint. On Cloudflare Workers, this causes two
failures:

1. **522 (Connection Timed Out)** — The Worker tries to HTTP-fetch its own public URL
   (`https://example.com/mcp`). In production, this request routes through Cloudflare's edge back to
   the same Worker, creating a self-referencing loop that times out.
2. **406 (Not Acceptable)** — The MCP server requires `Accept: application/json, text/event-stream`
   for SSE transport. The default `fetch` does not set this header.

Locally (even with `wrangler dev`), the self-fetch works because there is no Cloudflare edge proxy
in the loop.

### What the patch does

Adds a `createSafeFetch()` wrapper that:

1. **Uses `event.fetch`** — Nitro's event-scoped fetch uses `localFetch` internally. When the URL
   path starts with `/`, Nitro routes the request directly through its h3 handler stack without any
   network call. The wrapper strips the origin from same-origin URLs to ensure internal routing.
2. **Sets the Accept header** — Adds `application/json, text/event-stream` to every request so the
   MCP server accepts the connection.
3. **Converts headers to plain object** — Nitro's internal `fetchNodeRequestHandler` does not
   reliably handle `Headers` instances. The wrapper uses `Object.fromEntries(headers.entries())` to
   ensure headers are passed as a plain record.

The wrapper is injected into `createMCPClient({ transport: { ..., fetch } })`.

### Why not a route override?

The upstream Docus module registers the assistant route at build time. A local
`server/api/__docus__/assistant.ts` override was attempted but Docus's module registration order
means the upstream route takes precedence.

### Removal criteria

Remove when upstream Docus fixes MCP client transport for Cloudflare Workers. Specifically:

- Docus uses `event.fetch` or an equivalent internal routing mechanism for same-origin MCP calls
- Docus sets the required `Accept` header for MCP SSE transport

## 4. Type Compatibility

### Problem

Nuxt 4 tooling produces stricter types that conflict with Docus 5.9 internal code. `useNuxt()` and
module config types don't align.

### What the patch does

- Adds `as any` casts to `useNuxt()` calls in `modules/config.ts` and `nuxt.config.ts`
- Adds `defineNuxtConfig` import to `nuxt.config.ts`
- Guards `inferSiteURL()` return with a string type check

### Removal criteria

Remove when upstream Docus releases Nuxt 4 compatible types and `pnpm typecheck` passes clean.

## 5. Sitemap Landing Collection

### Problem

Docus routing disables landing collections when `app/pages/index.vue` exists. The sitemap handler
tries to query these missing collections, causing prerender failures.

### What the patch does

Removes the landing collection query from the sitemap handler.

### Removal criteria

Remove when upstream Docus handles optional landing collections in the sitemap handler.

## How To Update The Patch

1. Run `pnpm patch docus@5.9.0`.
2. Edit files in the temporary patch directory.
3. Run `pnpm patch-commit <temp-dir>`.
4. Commit changes to:
   - `patches/docus@5.9.0.patch`
   - `pnpm-workspace.yaml`
   - `pnpm-lock.yaml`

## General Removal Process

When all removal criteria are met for a specific fix:

1. Upgrade Docus to the version that includes the upstream fix.
2. Regenerate the patch without the resolved lines (or delete the patch entirely if all concerns are
   resolved).
3. Run `pnpm install` to refresh the lockfile.
4. Verify affected behavior (UI labels, OG images, assistant, types, sitemap).
5. Update references in:
   - `docs/config/README.md`
   - `docs/ai-integration/README.md`
   - `.agents/context/runtime-and-deployment.md`
   - `.agents/context/i18n-patches.md`
