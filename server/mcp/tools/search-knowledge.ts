/**
 * File overview:
 * - Registers MCP tool `search-knowledge`.
 * - Provides one cross-collection search entrypoint over `docs`, `faqs`, and `people`.
 * - Uses lightweight keyword scoring to return ranked matches with stable page URLs.
 * - Intended as the assistant's broad discovery tool before reading specific pages.
 */
import { queryCollection } from '@nuxt/content/server'
import { z } from 'zod'

const knowledgeTypes = ['docs', 'faqs', 'people'] as const

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
	description: `Searches across docs pages, FAQ entries, and klankbordgroep people records in one call.

WHEN TO USE:
- User asks a broad question and you don't know if the answer sits in docs, FAQ, or people.
- You need a quick shortlist of relevant sources before calling get-page.
- User asks practical questions ("hoe werkt dit", "wie doet mee", "welke inzichten").

OUTPUT:
- Ranked cross-collection results with type, title, summary, path, and URL.`,
	annotations: {
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false
	},
	inputSchema: {
		query: z.string().min(2).describe('Search query in natural language'),
		limit: z.number().int().min(1).max(25).default(10).describe('Maximum number of results'),
		types: z
			.array(z.enum(knowledgeTypes))
			.optional()
			.describe('Optional subset of sources to search: docs, faqs, people')
	},
	inputExamples: [
		{ query: 'selectie van kandidaten', limit: 8 },
		{ query: 'klankbordgroep', types: ['people'] }
	],
	cache: '10m',
	handler: async ({ query, limit, types }) => {
		const event = useEvent()
		const siteUrl = getRequestURL(event).origin

		const normalizedQuery = normalizeText(query)
		const tokens = tokenize(query)
		const requestedTypes = types?.length ? types : knowledgeTypes

		type KnowledgeResult = {
			type: (typeof knowledgeTypes)[number]
			title: string
			summary: string
			path: string
			url: string
			score: number
		}

		const results: KnowledgeResult[] = []

		if (requestedTypes.includes('docs')) {
			const docs = await queryCollection(event, 'docs')
				.select('title', 'description', 'path')
				.where('extension', '=', 'md')
				.where('path', 'NOT LIKE', '%/.navigation')
				.all()

			for (const doc of docs) {
				const path = doc.path || ''
				if (!path) {
					continue
				}

				const score =
					scoreText(normalizedQuery, tokens, doc.title || '', 60, 8) +
					scoreText(normalizedQuery, tokens, doc.description || '', 35, 5) +
					scoreText(normalizedQuery, tokens, path, 10, 2)

				if (score <= 0) {
					continue
				}

				results.push({
					type: 'docs',
					title: doc.title || path,
					summary: doc.description || '',
					path,
					url: `${siteUrl}${path}`,
					score
				})
			}
		}

		if (requestedTypes.includes('faqs')) {
			const faqs = await queryCollection(event, 'faqs')
				.select('title', 'description', 'path')
				.all()

			for (const faq of faqs) {
				const path = faq.path || '/docs/duik-dieper/veelgestelde-vragen'
				const score =
					scoreText(normalizedQuery, tokens, faq.title || '', 65, 10) +
					scoreText(normalizedQuery, tokens, faq.description || '', 40, 6)

				if (score <= 0) {
					continue
				}

				results.push({
					type: 'faqs',
					title: faq.title || 'Veelgestelde vraag',
					summary: faq.description || '',
					path,
					url: `${siteUrl}${path}`,
					score
				})
			}
		}

		if (requestedTypes.includes('people')) {
			const people = await queryCollection(event, 'people')
				.select('name', 'job', 'employer')
				.all()

			for (const person of people) {
				const summary = [person.job, person.employer].filter(Boolean).join(' · ')
				const score =
					scoreText(normalizedQuery, tokens, person.name || '', 70, 10) +
					scoreText(normalizedQuery, tokens, person.job || '', 40, 6) +
					scoreText(normalizedQuery, tokens, person.employer || '', 30, 4)

				if (score <= 0) {
					continue
				}

				results.push({
					type: 'people',
					title: person.name || 'Onbekend',
					summary,
					path: '/docs/duik-dieper/klankbordgroep',
					url: `${siteUrl}/docs/duik-dieper/klankbordgroep`,
					score
				})
			}
		}

		const ranked = results
			.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
			.slice(0, limit)

		return {
			query,
			total: ranked.length,
			results: ranked
		}
	}
})
