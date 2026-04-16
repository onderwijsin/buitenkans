/**
 * File overview:
 * - Registers MCP tool `list-faqs`.
 * - Lists FAQ entries from the `faqs` collection with optional query-based ranking.
 * - Can return either Q+A pairs or question-only output for compact assistant context.
 * - Used for practical "how/what/can" support questions and FAQ-specific retrieval.
 */
import { queryCollection } from '@nuxt/content/server'
import { z } from 'zod'

import { resolveWithFallback } from '../../utils/mcp-tool-runtime'

const faqCategories = [
	'algemeen',
	'strategie',
	'ontwerp',
	'start',
	'uitvoering',
	'succesfactoren',
	'behoud'
] as const

const faqAudiences = ['bestuurders', 'programmamakers'] as const

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
		categories: z
			.array(z.enum(faqCategories))
			.optional()
			.describe('Optional category filters (matches if FAQ category is in this list)'),
		audiences: z
			.array(z.enum(faqAudiences))
			.optional()
			.describe(
				'Optional audience filters (matches if FAQ has at least one selected audience)'
			),
		tags: z
			.array(z.string().min(1))
			.optional()
			.describe('Optional tag filters (matches if FAQ has at least one selected tag)'),
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
		{ categories: ['start', 'uitvoering'], audiences: ['bestuurders'] },
		{ query: 'anoniem gebruik', limit: 5 },
		{ query: 'AI', tags: ['behoud'], includeAnswers: false }
	],
	cache: '10m',
	handler: async ({ query, categories, audiences, tags, limit, includeAnswers }) => {
		const event = useEvent()
		const siteUrl = getRequestURL(event).origin

		const faqs = await resolveWithFallback(
			() =>
				queryCollection(event, 'faqs')
					.select(
						'title',
						'description',
						'path',
						'category',
						'audience',
						'tags',
						'related'
					)
					.all(),
			'faq source',
			[]
		)

		const normalizedQuery = query ? normalizeText(query) : ''
		const tokens = query ? tokenize(query) : []
		const normalizedTagFilters = (tags || []).map((tag) => normalizeText(tag))

		const filteredFaqs = faqs.filter((faq) => {
			if (categories?.length && (!faq.category || !categories.includes(faq.category))) {
				return false
			}

			if (audiences?.length) {
				const faqAudienceValues = faq.audience || []
				if (!faqAudienceValues.some((audience) => audiences.includes(audience))) {
					return false
				}
			}

			if (normalizedTagFilters.length) {
				const faqTags = (faq.tags || []).map((tag) => normalizeText(tag))
				if (!faqTags.some((tag) => normalizedTagFilters.includes(tag))) {
					return false
				}
			}

			return true
		})

		const ranked = filteredFaqs
			.map((faq) => {
				const score = query
					? scoreText(normalizedQuery, tokens, faq.title || '', 65, 10) +
						scoreText(normalizedQuery, tokens, faq.description || '', 40, 5) +
						scoreText(normalizedQuery, tokens, faq.category || '', 24, 5) +
						scoreText(normalizedQuery, tokens, (faq.audience || []).join(' '), 24, 5) +
						scoreText(normalizedQuery, tokens, (faq.tags || []).join(' '), 36, 6)
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
			filters: {
				categories: categories || [],
				audiences: audiences || [],
				tags: tags || []
			},
			total: ranked.length,
			items: ranked.map(({ faq }) => ({
				question: faq.title || '',
				...(includeAnswers ? { answer: faq.description || '' } : {}),
				path: faq.path || '',
				url: `${siteUrl}${faq.path || ''}`,
				category: faq.category || null,
				audience: faq.audience || [],
				tags: faq.tags || [],
				related: faq.related || [],
				relatedUrls: (faq.related || []).map((relatedPath) => `${siteUrl}${relatedPath}`),
				overviewUrl: `${siteUrl}/docs/duik-dieper/veelgestelde-vragen`
			}))
		}
	}
})
