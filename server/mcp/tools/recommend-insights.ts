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

const insightTagMap: Record<
	string,
	{
		theme: string
		keywords: string[]
	}
> = {
	'/docs/inzichten/gericht-orienteren': {
		theme: 'Oriëntatie en startfase',
		keywords: ['orientatie', 'oriëntatie', 'instroom', 'werving', 'start', 'verkenning']
	},
	'/docs/inzichten/potentieel-en-perspectief': {
		theme: 'Selectie en potentieel',
		keywords: ['selectie', 'potentieel', 'perspectief', 'geschikt', 'assessment', 'kandidaat']
	},
	'/docs/inzichten/leider-en-school': {
		theme: 'Organisatie en rolontwikkeling',
		keywords: ['school', 'bestuur', 'organisatie', 'verwachting', 'rol', 'samenwerking']
	},
	'/docs/inzichten/meerjarige-begeleiding': {
		theme: 'Begeleiding en behoud',
		keywords: ['begeleiding', 'coaching', 'nazorg', 'behoud', 'community', 'meerjarig']
	},
	'/docs/inzichten/persoonlijke-leerroutes': {
		theme: 'Leerroutes en maatwerk',
		keywords: ['leerroute', 'leerroutes', 'maatwerk', 'opleiding', 'curriculum', 'flexibel']
	},
	'/docs/inzichten/financier-orientatie': {
		theme: 'Financiering en subsidiëring',
		keywords: ['financiering', 'subsidie', 'budget', 'bekostiging', 'kosten', 'subsidiabel']
	}
}

export default defineMcpTool({
	description: `Recommends the most relevant "inzichten" pages for a specific user objective.

WHEN TO USE:
- User asks "waar moeten we beginnen?"
- User shares a concrete challenge (selectie, begeleiding, financiering, etc.)
- You want a focused reading list instead of all insight pages.

OUTPUT:
- Prioritized insight list with short rationale per recommendation.`,
	annotations: {
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false
	},
	inputSchema: {
		goal: z.string().min(2).describe('Primary objective or challenge'),
		context: z.string().optional().describe('Optional extra context'),
		max: z.number().int().min(1).max(6).default(3).describe('Maximum recommendations')
	},
	inputExamples: [
		{ goal: 'We willen betere selectie van zij-instromers', max: 3 },
		{
			goal: 'Hoe borgen we begeleiding na de start?',
			context: 'klein bestuur, beperkte capaciteit'
		}
	],
	cache: '10m',
	handler: async ({ goal, context, max }) => {
		const event = useEvent()
		const siteUrl = getRequestURL(event).origin
		const combinedInput = [goal, context].filter(Boolean).join(' ')
		const normalizedInput = normalizeText(combinedInput)
		const tokens = tokenize(combinedInput)

		const insights = await queryCollection(event, 'docs')
			.select('title', 'description', 'path', 'stem')
			.where('extension', '=', 'md')
			.where('stem', 'LIKE', '%1.inzichten%')
			.where('stem', 'NOT LIKE', '%00.overzicht%')
			.all()

		const scored = insights
			.map((insight) => {
				const path = insight.path || ''
				const tags = insightTagMap[path]
				const matchedKeywords =
					tags?.keywords.filter((keyword) =>
						normalizeText(combinedInput).includes(normalizeText(keyword))
					) || []

				const baseScore =
					scoreText(normalizedInput, tokens, insight.title || '', 45, 7) +
					scoreText(normalizedInput, tokens, insight.description || '', 25, 4)

				const keywordScore = matchedKeywords.length * 14
				const totalScore = baseScore + keywordScore

				return {
					title: insight.title || '',
					summary: insight.description || '',
					path,
					url: `${siteUrl}${path}`,
					theme: tags?.theme || 'Algemeen inzicht',
					matchedKeywords,
					score: totalScore
				}
			})
			.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))

		const shortlisted = scored.slice(0, max)

		return {
			goal,
			context: context || null,
			total: shortlisted.length,
			recommendations: shortlisted.map((item) => ({
				title: item.title,
				summary: item.summary,
				path: item.path,
				url: item.url,
				theme: item.theme,
				rationale:
					item.matchedKeywords.length > 0
						? `Matcht op: ${item.matchedKeywords.join(', ')}`
						: 'Relevante overlap met doel op basis van titel en beschrijving'
			}))
		}
	}
})
