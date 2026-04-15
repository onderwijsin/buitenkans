import { queryCollection } from '@nuxt/content/server'
import {
	createPageIntroMarkdown,
	getDocsPageOr404,
	sendMarkdown
} from '~~/server/utils/raw-markdown'
import { defineEventHandler } from 'h3'

type InsightCard = {
	title?: string | null
	description?: string | null
	path?: string | null
}

export default defineEventHandler(async (event) => {
	const [page, cards] = await Promise.all([
		getDocsPageOr404(event, '/docs/inzichten/overzicht'),
		queryCollection(event, 'docs')
			.select('title', 'description', 'path')
			.andWhere((query) =>
				query
					.where('extension', '=', 'md')
					.where('stem', 'LIKE', '%1.inzichten%')
					.where('stem', 'NOT LIKE', '%00.overzicht%')
			)
			.all() as Promise<InsightCard[]>
	])

	const lines = [createPageIntroMarkdown(page), '', '## Inzichten', '']

	if (!cards.length) {
		lines.push('Geen inzichten gevonden.')
		return sendMarkdown(event, lines.join('\n'))
	}

	for (const card of cards) {
		const title = card.title?.trim() || 'Zonder titel'
		const href = card.path?.trim() || ''
		const description = card.description?.trim()

		lines.push(`### [${title}](${href})`, '')

		if (description) {
			lines.push(description, '')
		}
	}

	return sendMarkdown(event, lines.join('\n'))
})
