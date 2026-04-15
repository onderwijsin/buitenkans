import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
	collections: {
		docs: defineCollection({
			type: 'page',
			source: {
				include: 'docs/**/*.md',
				prefix: '/docs'
			},
			schema: z.object({
				links: z
					.array(
						z.object({
							label: z.string(),
							icon: z.string(),
							to: z.string(),
							target: z.string().optional()
						})
					)
					.optional()
			})
		}),
		faqs: defineCollection({
			type: 'page',
			source: {
				include: 'faqs/**/*.md',
				prefix: '/faqs'
			},
			schema: z.object({
				title: z.string(),
				description: z.string()
			})
		}),
		people: defineCollection({
			type: 'data',
			source: 'people/**/*.yml',
			schema: z.object({
				name: z.string(),
				job: z.string(),
				employer: z.string().nullable(),
				avatar: z.string().nullable()
			})
		})
	}
})
