# AI Integration

This project currently uses AI through the **built-in Docus/Nuxt UI assistant**.

## Active AI Surface

- Assistant config in [`../../nuxt.config.ts`](../../nuxt.config.ts):
  - `assistant.model = 'mistral/mistral-medium'`
- Assistant FAQ starter prompts in [`../../app/app.config.ts`](../../app/app.config.ts)
- Gateway key in environment: `AI_GATEWAY_API_KEY` (see [`../../.example.env`](../../.example.env))
- MCP-backed assistant tool surface available at `/mcp` (provided by Docus + `@nuxtjs/mcp-toolkit`)

## Cloudflare Build Prerequisite

Because this project deploys Nitro with `preset: 'cloudflare_module'` and uses
`@nuxtjs/mcp-toolkit`, the runtime dependency `agents` must be installed.

Reason:

- MCP toolkit's Cloudflare transport imports `agents/mcp`.
- If `agents` is missing, production build fails with:
  - `Cannot resolve "agents/mcp" ... and externals are not allowed`

Keep `agents` in `dependencies` (not only `devDependencies`).

## Important Scope Clarification

This repository does **not** currently implement custom AI backend routes for report generation.
There is no active `/api/ai/*` route stack in `server/api`.

## Custom MCP Tools (Integrated Assistant)

To improve assistant quality for project-specific questions, this repo adds custom MCP tools in
[`../../server/mcp/tools`](../../server/mcp/tools):

- `search-knowledge` — unified search across `docs`, `faqs`, and `people`
- `list-insights` — structured list of all insight pages
- `recommend-insights` — objective-driven recommendations for which insights to read first
- `list-faqs` — FAQ listing with optional query filtering

These tools are consumed by the Docus assistant runtime through the configured MCP server.

## Provider/Gateway Context

Current project setup uses the AI assistant with:

- Mistral model identifier in assistant config
- AI Gateway key from environment

Project policy note:

- team configuration uses project-owned Mistral keys via gateway
- team treats gateway setup as ZDR-aligned

## Change Guidance

When changing assistant behavior:

1. Keep configuration in `nuxt.config.ts` and `app/app.config.ts` aligned.
2. Document any model/provider changes in both:
   - `docs/ai-integration/README.md`
   - `.agents/context/project-overview.md`
3. Avoid introducing custom AI server APIs unless explicitly requested.
