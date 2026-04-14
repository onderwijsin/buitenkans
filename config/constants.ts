/**
 * Centralized behavior and tuning constants.
 *
 * Keep runtime secrets in `runtimeConfig`; this file is for static defaults,
 * limits and keys that shape app behavior.
 */

/**
 * Product identity strings shown in metadata and page headers.
 */
export const APP_IDENTITY = {
	/** Main application title shown in browser/page metadata. */
	siteTitle: 'Buitenkans',
	/** Primary SEO description used in page metadata. */
	siteDescription: 'Samen bouwen aan routes voor leiders in het (primair) onderwijs'
} as const

/**
 * Stable keys for `useAsyncData` calls that should be shared/reused.
 */
export const ASYNC_DATA_KEYS = {
	/** Key for loading left-side content navigation tree. */
	navigation: 'navigation'
} as const

/**
 * Static Nuxt behavior knobs that do not belong in runtime env vars.
 */
export const NUXT_BEHAVIOR_CONFIG = {
	/** Nuxt/Nitro compatibility date for runtime behavior. */
	compatibilityDate: '2026-01-05',
	/** Explicit prerender entry routes for static generation. */
	nitroPrerenderRoutes: ['/overview'],
	/** Max CPU budget (ms) for Cloudflare worker requests. */
	nitroCpuMs: 30000,
	/** TOC depth used by Nuxt Content markdown build step. */
	contentTocSearchDepth: 2,
	/** Separator used in generated document/page titles. */
	titleSeparator: '|',
	/** Default locale code used by site-level config. */
	defaultLocale: 'nl',
	/** Language code used in metadata/public config. */
	language: 'nl_NL',
	/** Public contact page URL used in UI config. */
	publicContactPage: 'https://onderwijsin.nl/contact',
	/** Plausible proxy endpoint mounted by Nuxt module. */
	plausibleProxyBaseEndpoint: '/api/_plausible',
	/** Hostnames excluded from Plausible tracking. */
	plausibleIgnoredHostnames: ['localhost']
} as const

/**
 * Header names used by request security middleware/helpers.
 */
export const SECURITY_HEADERS = {
	/** Turnstile token header sent by clients to protected routes. */
	turnstileToken: 'x-turnstile-token',
	/** Admin bypass token header used for server-to-server testing. */
	adminToken: 'x-admin-token'
} as const
