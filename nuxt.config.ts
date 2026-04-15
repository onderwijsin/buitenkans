// https://nuxt.com/docs/api/configuration/nuxt-config
import type { Mode } from './shared/types/primitives'

import { fileURLToPath } from 'node:url'

import { joinURL, parseURL } from 'ufo'

import { NUXT_BEHAVIOR_CONFIG } from './config/constants'
import { app } from './config/head'
import { siteDescription, siteTitle } from './config/identity'

const SUPPORTED_MODES = ['dev', 'prod', 'preview'] as const

function resolveMode(value: string | undefined): Mode {
	if (!value) {
		return 'dev'
	}

	return (SUPPORTED_MODES as readonly string[]).includes(value) ? (value as Mode) : 'dev'
}

function resolveSentryEnvironment(value: Mode): 'development' | 'production' | 'preview' {
	switch (value) {
		case 'prod':
			return 'production'
		case 'preview':
			return 'preview'
		default:
			return 'development'
	}
}

// Runtime modes
const mode = resolveMode(process.env.MODE)
const sentryEnvironment = resolveSentryEnvironment(mode)
const isDebug = process.env.DEBUG === 'true'
const isProd = mode === 'prod'
const isPreview = mode === 'preview'
const isDev = mode === 'dev'
const sentryEnabled = process.env.SENTRY_ENABLED !== 'false'

export default defineNuxtConfig({
	extends: ['docus'],
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/plausible',
		'@sentry/nuxt/module',
		'@vueuse/nuxt',
		'@nuxthub/core',
		'nuxt-studio',
		'@vueuse/nuxt',
		'@nuxt/fonts'
	],

	devtools: {
		enabled: true
	},

	alias: {
		'@server': fileURLToPath(new URL('./server', import.meta.url)),
		'@constants': fileURLToPath(new URL('./config/constants', import.meta.url))
	},

	css: ['~/assets/css/main.css'],

	sourcemap: {
		client: 'hidden'
	},

	experimental: {
		inlineRouteRules: true,
		// Temporary mitigation for duplicate internal `useAppConfig` auto-import warnings in Nuxt/Nitro.
		serverAppConfig: false
	},

	$development: {
		routeRules: {
			'/**': { cache: false }
		}
	},

	$production: {
		routeRules: {
			'/**': { prerender: true },
			'/assets/**': {
				ssr: false,
				cache: false
			}
		}
	},

	routeRules: {
		'/stats': {
			redirect: {
				statusCode: 301,
				to: `https://plausible.io/${process.env.PLAUSIBLE_DOMAIN}`
			}
		}
	},

	compatibilityDate: NUXT_BEHAVIOR_CONFIG.compatibilityDate,

	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	],

	vite: {
		optimizeDeps: {
			include: [
				'@plausible-analytics/tracker',
				'@vue/devtools-core',
				'@vue/devtools-kit',
				// 'fuse.js',
				// '@vueuse/integrations/useFuse',
				'zod'
				// '@tiptap/core',
				// '@tiptap/starter-kit',
				// '@tiptap/markdown',
				// '@tiptap/**'
			]
		}
	},

	nitro: {
		minify: !isDebug,
		prerender: {
			crawlLinks: true,
			failOnError: true,
			routes: [...NUXT_BEHAVIOR_CONFIG.nitroPrerenderRoutes]
		},
		preset: 'cloudflare_module',
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: {
				name: process.env.WORKER_NAME,
				assets: {
					directory: './.output/public/',
					binding: 'ASSETS'
				},
				observability: {
					logs: {
						enabled: true,
						head_sampling_rate: 1,
						invocation_logs: true
					}
				},
				vars: {
					// We need runtime access to this var via process.env
					STUDIO_GITHUB_CLIENT_ID: process.env.STUDIO_GITHUB_CLIENT_ID
				},
				limits: {
					cpu_ms: NUXT_BEHAVIOR_CONFIG.nitroCpuMs // Increase max cpu time to 5 min due to expensive AI requests
				},
				d1_databases: [
					{
						database_id: process.env.CLOUDFLARE_D1_DATABASE_ID,
						binding: 'DB'
					}
				],
				kv_namespaces: [
					{
						binding: 'CACHE',
						id: process.env.CLOUDFLARE_CACHE_NAMESPACE_ID
					}
				],
				r2_buckets: [
					{
						binding: 'BLOB',
						bucket_name: process.env.CLOUDFLARE_R2_BUCKET,
						jurisdiction: 'eu'
					}
				]
			}
		}
	},

	hub: {
		// We dont need DB here, since nuxthub should not provision it (Nuxt Content will do that)
		blob: {
			driver: 'cloudflare-r2',
			bucketName: process.env.CLOUDFLARE_R2_BUCKET,
			binding: 'BLOB'
		},

		cache: true
	},

	image: {
		provider: 'cloudflare',
		cloudflare: {
			// During local development, we so to fetch images from the prod server!
			baseURL: joinURL(process.env.PROD_URL ?? process.env.APP_URL!)
		}
	},

	studio: {
		dev: false,
		route: '/studio',
		i18n: {
			defaultLocale: 'nl'
		},
		repository: {
			provider: 'github',
			owner: process.env.GH_ORG,
			repo: process.env.GH_REPO,
			branch: 'content'
		},
		media: {
			external: true,
			prefix: '/assets'
		},
		auth: {
			github: {
				clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
				clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET
			}
		}
	},

	debug: {
		nitro: isDebug,
		hydration: isDebug || isDev || isPreview,
		watchers: isDebug || isDev,
		router: isDebug,
		templates: isDebug,
		modules: isDebug,
		hooks: {
			server: isDebug,
			client: isDebug
		}
	},

	sentry: {
		org: process.env.SENTRY_ORG,
		project: process.env.SENTRY_PROJECT,
		authToken: process.env.SENTRY_AUTH_TOKEN,
		sourcemaps: {
			disable: !sentryEnabled || process.env.SENTRY_UPLOAD_SOURCE_MAPS !== 'true'
		}
	},

	runtimeConfig: {
		apiToken: process.env.API_TOKEN,
		cloudflare: {
			accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
			apiToken: process.env.CLOUDFLARE_API_TOKEN,
			cacheNamespaceId: process.env.CLOUDFLARE_CACHE_NAMESPACE_ID
		},
		public: {
			siteUrl: process.env.APP_URL,
			titleSeparator: NUXT_BEHAVIOR_CONFIG.titleSeparator,
			language: NUXT_BEHAVIOR_CONFIG.language, // prefer more explicit language codes like `en-AU` over `en`
			sentry: {
				enabled: sentryEnabled,
				dsn: process.env.SENTRY_DSN,
				release: process.env.SENTRY_RELEASE,
				environment: sentryEnvironment
			},
			mode: {
				isDev,
				isProd,
				isPreview,
				isDebug,
				value: mode
			},
			tracking: {
				disabled: process.env.DISABLE_TRACKING === 'true'
			},
			contact: {
				page: NUXT_BEHAVIOR_CONFIG.publicContactPage
			}
		}
	},

	app: {
		keepalive: true,
		head: app.head
	},

	ui: {
		theme: {
			colors: ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info']
		}
		// experimental: {
		// 	componentDetection: true
		// }
	},

	assistant: {
		// AI model (uses AI SDK Gateway format)
		model: 'mistral/mistral-medium'
	},

	fonts: {
		families: [{ name: 'Poppins', provider: 'google', weights: [200, 400, 500, 700] }]
	},

	plausible: {
		domain: process.env.PLAUSIBLE_DOMAIN || parseURL(process.env.APP_URL).host,
		// https://github.com/nuxt-modules/plausible?tab=readme-ov-file#proxy-configuration
		// Proxy is broken, probably due to edge runtime
		proxy: true,
		proxyBaseEndpoint: NUXT_BEHAVIOR_CONFIG.plausibleProxyBaseEndpoint,
		ignoredHostnames: [...NUXT_BEHAVIOR_CONFIG.plausibleIgnoredHostnames],
		autoPageviews: true,
		autoOutboundTracking: true
	},

	site: {
		name: siteTitle,
		description: siteDescription,
		url: process.env.APP_URL,
		titleSeparator: NUXT_BEHAVIOR_CONFIG.titleSeparator,
		defaultLocale: NUXT_BEHAVIOR_CONFIG.defaultLocale, // not needed if you have @nuxtjs/i18n installed
		language: NUXT_BEHAVIOR_CONFIG.language,
		indexable: isProd,
		trailingSlash: false
	},

	llms: {
		domain: process.env.APP_URL,

		title: siteTitle,

		description:
			'Praktische handreiking voor het ontwerpen, opzetten en verbeteren van trajecten voor zij-instroom van schoolleiders in het primair onderwijs. Gebaseerd op inzichten uit het project Buitenkans.',

		full: {
			title: 'Volledige documentatie Buitenkans',
			description:
				'Deze documentatie bundelt alle inzichten, succesfactoren en ontwerpprincipes uit het project Buitenkans. Gericht op schoolbestuurders en programmamakers die werken aan instroomroutes voor schoolleiders van buiten het onderwijs.'
		},

		sections: [
			{
				title: 'Inzichten en hulpmiddelen',
				description:
					'Kerninzichten en succesfactoren voor het werven, selecteren, ontwikkelen en behouden van schoolleiders. Inclusief concrete aanbevelingen voor bestuurders en opleiders.',
				contentCollection: 'docs'
			},
			{
				title: 'Veelgestelde vragen',
				description:
					'Praktische antwoorden op veelgestelde vragen over het project Buitenkans en de implementatie van instroomroutes voor schoolleiders.',
				contentCollection: 'faqs'
			}
		]
	}
})
