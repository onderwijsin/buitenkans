/**
 * File overview:
 * - Registers MCP tool `list-insights`.
 * - Returns the full ordered set of insight pages from the `docs` collection.
 * - Filters to the `1.inzichten` section and excludes the overview page itself.
 * - Used when the assistant must enumerate all insights before narrowing recommendations.
 */
import { queryCollection } from '@nuxt/content/server'
import { z } from 'zod'

import { resolveWithFallback } from '../../utils/mcp-tool-runtime'

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

		const insights = await resolveWithFallback(
			() =>
				queryCollection(event, 'docs')
					.select('title', 'description', 'path', 'stem')
					.where('extension', '=', 'md')
					.where('stem', 'LIKE', '%1.inzichten%')
					.where('stem', 'NOT LIKE', '%00.overzicht%')
					.all(),
			'insights source',
			[]
		)

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
