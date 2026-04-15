# Sentry

Sentry is enabled for runtime observability in this Nuxt + Cloudflare deployment.

## Active Integration Points

- Nuxt module config in [`../../nuxt.config.ts`](../../nuxt.config.ts)
- Client config in [`../../sentry.client.config.ts`](../../sentry.client.config.ts)
- Nitro plugin in
  [`../../server/plugins/sentry-cloudflare-plugin.ts`](../../server/plugins/sentry-cloudflare-plugin.ts)
- Test route in
  [`../../server/api/_sentry/trigger-error.get.ts`](../../server/api/_sentry/trigger-error.get.ts)

## Runtime Config Shape

Public runtime fields used by server/client runtime:

- `public.sentry.enabled`
- `public.sentry.dsn`
- `public.sentry.release`
- `public.sentry.environment`

Environment is derived from `MODE` (`dev`, `preview`, `prod`).

## Build-Time Requirements

For source map upload:

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_UPLOAD_SOURCE_MAPS=true`

## Verification

1. Start app in production-like mode.
2. Trigger `GET /api/_sentry/trigger-error`.
3. Confirm event appears in Sentry for the expected environment.
