# Server Runtime

This document describes active server routes and runtime behavior.

## Active Server Files

- `server/api/_sentry/trigger-error.get.ts`
- `server/api/content.get.ts`
- `server/api/resources.get.ts`
- `server/mcp/tools/search-knowledge.ts`
- `server/mcp/tools/list-insights.ts`
- `server/mcp/tools/recommend-insights.ts`
- `server/mcp/tools/list-faqs.ts`
- `server/routes/assets/[...pathname].get.ts`
- `server/routes/raw/docs/inzichten/overzicht.md.get.ts`
- `server/routes/raw/docs/duik-dieper/klankbordgroep.md.get.ts`
- `server/routes/raw/docs/duik-dieper/veelgestelde-vragen.md.get.ts`
- `server/plugins/sentry-cloudflare-plugin.ts`
- `server/utils/raw-markdown.ts`
- `server/utils/security/admin.ts`

## Route Summary

### `POST /mcp` (MCP server)

Docus includes an MCP server that powers the integrated assistant.

In addition to Docus defaults (`list-pages`, `get-page`), this project provides custom tools in
`server/mcp/tools/*` for domain-specific retrieval and recommendations:

| Tool                 | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `search-knowledge`   | Unified search across `docs`, `faqs`, and `people` collections.    |
| `list-insights`      | Structured list of all insight pages with optional summaries.      |
| `recommend-insights` | Objective-driven recommendations for which insights to read first. |
| `list-faqs`          | FAQ listing with optional query filtering and ranked results.      |

See [`../ai-integration/README.md`](../ai-integration/README.md) for assistant config and MCP
transport details.

Cloudflare deployment note:

- `@nuxtjs/mcp-toolkit` Cloudflare provider imports `agents/mcp`.
- `agents` must be present in project `dependencies` or Nitro build will fail to resolve it.

### `GET /api/_sentry/trigger-error`

Intentional throw route used to verify Sentry capture.

### `GET /assets/**`

Serves media from `hub:blob` (R2 binding) and prepends `/assets/` to Studio-uploaded paths.

### `GET /api/content` and `GET /api/resources`

Both routes query the `docs` collection:

- `/api/content` returns all markdown docs pages (excluding `.navigation` docs files).
- `/api/resources` returns markdown docs pages under `/docs/duik-dieper/**` (excluding `.navigation`
  docs files).

If you change route purpose, keep query filters aligned with `content.config.ts` collections.

### `GET /raw/docs/**.md` (dynamic override subset)

Nuxt Content + `nuxt-llms` already provides a default `/raw/:path.md` endpoint.

This project intentionally overrides three routes where frontend pages are Vue-rendered from dynamic
collections, to ensure raw markdown matches what users and agents see in the frontend:

- `/raw/docs/inzichten/overzicht.md`
- `/raw/docs/duik-dieper/klankbordgroep.md`
- `/raw/docs/duik-dieper/veelgestelde-vragen.md`

See [`./raw-markdown-overrides.md`](./raw-markdown-overrides.md) for rationale, extension steps, and
removal criteria.

## Security Utility

`server/utils/security/admin.ts` checks admin token headers:

- `x-admin-token: <API_TOKEN>`
- `Authorization: Bearer <API_TOKEN>`

This helper is available for trusted server-to-server checks.
