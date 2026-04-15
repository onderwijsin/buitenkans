import type { Collections } from '@nuxt/content'

import { queryCollection } from '@nuxt/content/server'
import { z } from 'zod'

const normalizeText = (value: string) =>
	value
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim()

const tokenize = (value: string) =>
	normalizeText(value)
		.split(/[^a-z0-9]+/g)
		.filter((token) => token.length > 1)

const scoreText = (
	query: string,
	tokens: string[],
	value: string,
	exactWeight: number,
	tokenWeight: number
) => {
	const normalizedValue = normalizeText(value)
	if (!normalizedValue) {
		return 0
	}

	let score = 0

	if (normalizedValue.includes(query)) {
		score += exactWeight
	}

	for (const token of tokens) {
		if (normalizedValue.includes(token)) {
			score += tokenWeight
		}
	}

	return score
}

export default defineMcpTool({
	description: `Lists FAQ entries with optional query filtering.

WHEN TO USE:
- User asks practical "hoe/kan/wat" questions.
- You need concise Q/A output without traversing full docs pages.
- You want a focused FAQ subset for a specific keyword.`,
	annotations: {
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false
	},
	inputSchema: {
		query: z.string().optional().describe('Optional query to filter FAQs'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(50)
			.default(20)
			.describe('Maximum number of FAQ entries'),
		includeAnswers: z
			.boolean()
			.default(true)
			.describe('Include full answer text (description field)')
	},
	inputExamples: [
		{},
		{ query: 'anoniem gebruik', limit: 5 },
		{ query: 'AI', includeAnswers: false }
	],
	cache: '10m',
	handler: async ({ query, limit, includeAnswers }) => {
		const event = useEvent()
		const siteUrl = getRequestURL(event).origin

		const faqs = await queryCollection(event, 'faqs' as keyof Collections)
			.select('title', 'description', 'path')
			.all()

		const normalizedQuery = query ? normalizeText(query) : ''
		const tokens = query ? tokenize(query) : []

		const ranked = faqs
			.map((faq) => {
				const score = query
					? scoreText(normalizedQuery, tokens, faq.title || '', 65, 10) +
						scoreText(normalizedQuery, tokens, faq.description || '', 40, 5)
					: 1

				return { faq, score }
			})
			.filter(({ score }) => score > 0)
			.sort((a, b) => {
				if (query) {
					return b.score - a.score
				}
				return (a.faq.path || '').localeCompare(b.faq.path || '')
			})
			.slice(0, limit)

		return {
			query: query || null,
			total: ranked.length,
			items: ranked.map(({ faq }) => ({
				question: faq.title || '',
				...(includeAnswers ? { answer: faq.description || '' } : {}),
				path: faq.path || '',
				url: `${siteUrl}${faq.path || ''}`,
				overviewUrl: `${siteUrl}/docs/duik-dieper/veelgestelde-vragen`
			}))
		}
	}
})
