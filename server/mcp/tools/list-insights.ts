import type { Collections } from '@nuxt/content'

import { queryCollection } from '@nuxt/content/server'
import { z } from 'zod'

export default defineMcpTool({
	description: `Lists all "inzichten" pages as a structured set.

WHEN TO USE:
- User asks which core insights exist.
- You need a complete overview before recommending a subset.
- You want stable links to all insight pages.`,
	annotations: {
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false
	},
	inputSchema: {
		includeSummary: z
			.boolean()
			.default(true)
			.describe('Include each insight description in output')
	},
	inputExamples: [{}, { includeSummary: false }],
	cache: '1h',
	handler: async ({ includeSummary }) => {
		const event = useEvent()
		const siteUrl = getRequestURL(event).origin

		const insights = await queryCollection(event, 'docs' as keyof Collections)
			.select('title', 'description', 'path', 'stem')
			.where('extension', '=', 'md')
			.where('stem', 'LIKE', '%1.inzichten%')
			.where('stem', 'NOT LIKE', '%00.overzicht%')
			.all()

		const ordered = insights.sort((a, b) => (a.stem || '').localeCompare(b.stem || ''))

		return {
			total: ordered.length,
			items: ordered.map((item) => ({
				title: item.title || '',
				...(includeSummary ? { summary: item.description || '' } : {}),
				path: item.path || '',
				url: `${siteUrl}${item.path || ''}`
			}))
		}
	}
})
