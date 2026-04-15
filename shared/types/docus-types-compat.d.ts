/**
 * Temporary compatibility shim for Nuxt 4 + Docus 5.9 typechecking.
 *
 * Why:
 * - Docus currently causes RuntimeConfig/PublicRuntimeConfig to be narrowed
 *   incorrectly during `nuxi typecheck` in some projects.
 * - This surfaces as false positives like `Property 'public' does not exist on type RuntimeConfig`.
 *
 * Remove this file when upstream Docus/Nuxt type compatibility is fixed and
 * `pnpm typecheck` passes without it.
 */
declare module '@nuxt/schema' {
	interface PublicRuntimeConfig {
		tracking: {
			disabled: boolean
		}
		sentry: {
			enabled: boolean
			dsn?: string
			release?: string
			environment?: string
		}
		mode: {
			isDebug: boolean
		}
		assistant: {
			apiPath: string
			enabled: boolean
		}
		[key: string]: unknown
	}

	interface RuntimeConfig {
		public: PublicRuntimeConfig
		assistant: {
			mcpServer: string
			model: string
		}
		apiToken: string
		[key: string]: unknown
	}
}

export {}
