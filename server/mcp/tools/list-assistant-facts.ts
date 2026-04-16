/**
 * File overview:
 * - Registers MCP tool `list-assistant-facts`.
 * - Lists assistant-only guidance facts from the `assistantFacts` data collection.
 * - Supports lightweight query ranking for factual configuration questions.
 * - Intended to reduce assistant hallucinations on project-specific facts.
 */
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
	description: `Lists assistant-only guidance facts for project-specific behavior.

WHEN TO USE:
- User asks about assistant configuration details (e.g. active model).
- You need guardrails/facts that are intentionally not published in app pages.
- You want concise, explicit internal guidance before answering.`,
	annotations: {
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false
	},
	inputSchema: {
		query: z.string().optional().describe('Optional natural-language query'),
		tags: z.array(z.string().min(1)).optional().describe('Optional tag filter'),
		limit: z.number().int().min(1).max(50).default(20).describe('Maximum number of facts')
	},
	inputExamples: [
		{},
		{ query: 'which model do you use' },
		{ query: 'assistant model', limit: 5 }
	],
	cache: '10m',
	handler: async ({ query, tags, limit }) => {
		const event = useEvent()

		const facts = await queryCollection(event, 'assistantFacts')
			.select('key', 'title', 'summary', 'guidance', 'aliases', 'tags', 'priority')
			.all()

		const normalizedQuery = query ? normalizeText(query) : ''
		const tokens = query ? tokenize(query) : []
		const normalizedTagFilters = (tags || []).map((tag) => normalizeText(tag))

		const filteredFacts = facts.filter((fact) => {
			if (!normalizedTagFilters.length) {
				return true
			}

			const factTags = (fact.tags || []).map((tag) => normalizeText(tag))
			return factTags.some((tag) => normalizedTagFilters.includes(tag))
		})

		const ranked = filteredFacts
			.map((fact) => {
				const score = query
					? scoreText(normalizedQuery, tokens, fact.title || '', 70, 10) +
						scoreText(normalizedQuery, tokens, fact.summary || '', 45, 7) +
						scoreText(normalizedQuery, tokens, fact.guidance || '', 55, 8) +
						scoreText(normalizedQuery, tokens, (fact.aliases || []).join(' '), 65, 10) +
						scoreText(normalizedQuery, tokens, (fact.tags || []).join(' '), 28, 5)
					: 1

				return {
					fact,
					score,
					priority: fact.priority || 3
				}
			})
			.filter(({ score }) => score > 0)
			.sort((a, b) => {
				if (query) {
					return b.score - a.score || b.priority - a.priority
				}
				return b.priority - a.priority || (a.fact.key || '').localeCompare(b.fact.key || '')
			})
			.slice(0, limit)

		return {
			query: query || null,
			filters: {
				tags: tags || []
			},
			total: ranked.length,
			items: ranked.map(({ fact }) => ({
				key: fact.key || '',
				title: fact.title || '',
				summary: fact.summary || '',
				guidance: fact.guidance || '',
				aliases: fact.aliases || [],
				tags: fact.tags || [],
				priority: fact.priority || 3
			}))
		}
	}
})
