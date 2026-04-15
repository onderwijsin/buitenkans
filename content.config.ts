import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
	collections: {
		faqs: defineCollection({
			type: 'data',
			source: 'faqs/**.yml',
			schema: z.object({
				title: z.string(),
				description: z.string()
			})
		}),
		people: defineCollection({
			type: 'data',
			source: 'people/**.yml',
			schema: z.object({
				name: z.string(),
				job: z.string(),
				employer: z.string().nullable(),
				avatar: z.string().nullable()
			})
		})
	}
})
