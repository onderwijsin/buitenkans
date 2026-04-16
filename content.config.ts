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
				description: z.string(),

				// NIEUW 👇
				category: z
					.enum([
						'algemeen',
						'strategie',
						'ontwerp',
						'start',
						'uitvoering',
						'succesfactoren',
						'behoud'
					])
					.optional(),

				audience: z.array(z.enum(['bestuurders', 'programmamakers'])).optional(),

				tags: z.array(z.string()).optional(),

				related: z.array(z.string()).optional()
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
		}),
		assistantFacts: defineCollection({
			type: 'data',
			source: 'assistant-facts/**/*.yml',
			schema: z.object({
				key: z.string(),
				title: z.string(),
				summary: z.string(),
				guidance: z.string(),
				aliases: z.array(z.string()).optional(),
				tags: z.array(z.string()).optional(),
				priority: z.number().int().min(1).max(5).default(3)
			})
		})
	}
})
