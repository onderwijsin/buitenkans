import { defineCollection, defineContentConfig } from '@nuxt/content'
import { defineRobotsSchema } from '@nuxtjs/robots/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { defineOgImageSchema } from 'nuxt-og-image/content'
import { defineSchemaOrgSchema } from 'nuxt-schema-org/content'
import { z } from 'zod'

export default defineContentConfig({
	collections: {
		items: defineCollection({
			type: 'page',
			source: {
				include: 'items/**',
				exclude: [],
				// Drops the leading /items prefix in path. We only use that for organisation; it should not have an effect on front end routing!
				prefix: '/'
			},
			schema: z.object({
				title: z.string(),
				description: z.string(),
				date: z.iso.date(),
				robots: defineRobotsSchema(),
				sitemap: defineSitemapSchema(),
				ogImage: defineOgImageSchema(),
				schemaOrg: defineSchemaOrgSchema()
			})
		}),
		resources: defineCollection({
			type: 'page',
			source: {
				include: 'resources/**/*.md',
				exclude: []
			},
			schema: z.object({
				title: z.string(),
				description: z.string(),
				category: z.enum(['tool', 'source', 'media']),
				date: z.iso.date(),
				robots: defineRobotsSchema(),
				sitemap: defineSitemapSchema(),
				ogImage: defineOgImageSchema(),
				schemaOrg: defineSchemaOrgSchema()
			})
		}),
		faqs: defineCollection({
			type: 'page',
			source: 'faqs/**.yml',
			schema: z.object({
				title: z.string(),
				description: z.string()
			})
		})
	}
})
