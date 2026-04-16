/**
 * File overview:
 * - Registers MCP tool `search-knowledge`.
 * - Provides one cross-collection search entrypoint over `docs`, `faqs`, `people`, and `assistantFacts`.
 * - Uses lightweight keyword scoring to return ranked matches with stable page URLs.
 * - Intended as the assistant's broad discovery tool before reading specific pages.
 */
import { queryCollection } from '@nuxt/content/server'
import { z } from 'zod'

const knowledgeTypes = ['docs', 'faqs', 'people', 'assistantFacts'] as const
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
	description: `Searches across docs pages, FAQ entries, klankbordgroep people records, and assistant-only guidance facts in one call.

WHEN TO USE:
- User asks a broad question and you don't know if the answer sits in docs, FAQ, or people.
- User asks configuration questions about the assistant itself.
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
			.describe('Optional subset of sources to search: docs, faqs, people, assistantFacts'),
		faqCategories: z
			.array(z.enum(faqCategories))
			.optional()
			.describe('Optional FAQ category filters (applied only when searching faqs)'),
		faqAudiences: z
			.array(z.enum(faqAudiences))
			.optional()
			.describe('Optional FAQ audience filters (applied only when searching faqs)'),
		faqTags: z
			.array(z.string().min(1))
			.optional()
			.describe('Optional FAQ tag filters (applied only when searching faqs)')
	},
	inputExamples: [
		{ query: 'selectie van kandidaten', limit: 8 },
		{ query: 'klankbordgroep', types: ['people'] },
		{ query: 'begeleiding', types: ['faqs'], faqCategories: ['behoud'] }
	],
	cache: '10m',
	handler: async ({ query, limit, types, faqCategories, faqAudiences, faqTags }) => {
		const event = useEvent()
		const siteUrl = getRequestURL(event).origin

		const normalizedQuery = normalizeText(query)
		const tokens = tokenize(query)
		const requestedTypes = types?.length ? types : knowledgeTypes
		const normalizedFaqTagFilters = (faqTags || []).map((tag) => normalizeText(tag))

		type KnowledgeResult = {
			type: (typeof knowledgeTypes)[number]
			title: string
			summary: string
			path: string
			url: string
			score: number
			faqMeta?: {
				category: string | null
				audience: string[]
				tags: string[]
				related: string[]
				relatedUrls: string[]
			}
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
				.select('title', 'description', 'path', 'category', 'audience', 'tags', 'related')
				.all()

			for (const faq of faqs) {
				if (
					faqCategories?.length &&
					(!faq.category || !faqCategories.includes(faq.category))
				) {
					continue
				}

				if (faqAudiences?.length) {
					const faqAudienceValues = faq.audience || []
					if (!faqAudienceValues.some((audience) => faqAudiences.includes(audience))) {
						continue
					}
				}

				if (normalizedFaqTagFilters.length) {
					const faqTagValues = (faq.tags || []).map((tag) => normalizeText(tag))
					if (!faqTagValues.some((tag) => normalizedFaqTagFilters.includes(tag))) {
						continue
					}
				}

				const path = faq.path || '/docs/duik-dieper/veelgestelde-vragen'
				const score =
					scoreText(normalizedQuery, tokens, faq.title || '', 65, 10) +
					scoreText(normalizedQuery, tokens, faq.description || '', 40, 6) +
					scoreText(normalizedQuery, tokens, faq.category || '', 25, 5) +
					scoreText(normalizedQuery, tokens, (faq.audience || []).join(' '), 24, 5) +
					scoreText(normalizedQuery, tokens, (faq.tags || []).join(' '), 32, 6)

				if (score <= 0) {
					continue
				}

				results.push({
					type: 'faqs',
					title: faq.title || 'Veelgestelde vraag',
					summary: faq.description || '',
					path,
					url: `${siteUrl}${path}`,
					faqMeta: {
						category: faq.category || null,
						audience: faq.audience || [],
						tags: faq.tags || [],
						related: faq.related || [],
						relatedUrls: (faq.related || []).map(
							(relatedPath) => `${siteUrl}${relatedPath}`
						)
					},
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

		if (requestedTypes.includes('assistantFacts')) {
			const facts = await queryCollection(event, 'assistantFacts')
				.select('key', 'title', 'summary', 'guidance', 'aliases', 'tags', 'priority')
				.all()

			for (const fact of facts) {
				const score =
					scoreText(normalizedQuery, tokens, fact.title || '', 70, 10) +
					scoreText(normalizedQuery, tokens, fact.summary || '', 40, 6) +
					scoreText(normalizedQuery, tokens, fact.guidance || '', 50, 8) +
					scoreText(normalizedQuery, tokens, (fact.aliases || []).join(' '), 65, 10) +
					scoreText(normalizedQuery, tokens, (fact.tags || []).join(' '), 30, 5)

				if (score <= 0) {
					continue
				}

				results.push({
					type: 'assistantFacts',
					title: fact.title || fact.key || 'Assistant fact',
					summary: fact.summary || '',
					path: `assistant-facts:${fact.key || 'unknown'}`,
					url: `assistant-facts:${fact.key || 'unknown'}`,
					score: score + (fact.priority || 3) * 2
				})
			}
		}

		const ranked = results
			.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
			.slice(0, limit)

		return {
			query,
			filters: {
				types: requestedTypes,
				faqCategories: faqCategories || [],
				faqAudiences: faqAudiences || [],
				faqTags: faqTags || []
			},
			total: ranked.length,
			results: ranked
		}
	}
})
