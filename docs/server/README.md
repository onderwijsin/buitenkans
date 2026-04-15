# Server Runtime

This document describes active server routes and runtime behavior.

## Active Server Files

- `server/api/_sentry/trigger-error.get.ts`
- `server/api/content.get.ts`
- `server/api/resources.get.ts`
- `server/routes/assets/[...pathname].get.ts`
- `server/plugins/sentry-cloudflare-plugin.ts`
- `server/utils/security/admin.ts`

## Route Summary

### `GET /api/_sentry/trigger-error`

Intentional throw route used to verify Sentry capture.

### `GET /assets/**`

Serves media from `hub:blob` (R2 binding) and prepends `/assets/` to Studio-uploaded paths.

### `GET /api/content` and `GET /api/resources`

These routes query markdown collections named `items` and `resources`.

If these routes are used in your deployment flow, keep route collection names and content collection
configuration aligned.

## Security Utility

`server/utils/security/admin.ts` checks admin token headers:

- `x-admin-token: <API_TOKEN>`
- `Authorization: Bearer <API_TOKEN>`

This helper is available for trusted server-to-server checks.
