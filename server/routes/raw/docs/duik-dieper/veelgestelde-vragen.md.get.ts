import { queryCollection } from '@nuxt/content/server'
import {
	createPageIntroMarkdown,
	getDocsPageOr404,
	sendMarkdown
} from '~~/server/utils/raw-markdown'
import { defineEventHandler } from 'h3'

type Faq = {
	title?: string | null
	description?: string | null
}

export default defineEventHandler(async (event) => {
	const [page, faqs] = await Promise.all([
		getDocsPageOr404(event, '/docs/duik-dieper/veelgestelde-vragen'),
		queryCollection(event, 'faqs').select('title', 'description').all() as Promise<Faq[]>
	])

	const lines = [createPageIntroMarkdown(page), '', '## Veelgestelde vragen', '']

	if (!faqs.length) {
		lines.push('Geen veelgestelde vragen gevonden.')
		return sendMarkdown(event, lines.join('\n'))
	}

	for (const faq of faqs) {
		const title = faq.title?.trim() || 'Vraag zonder titel'
		const description = faq.description?.trim()

		lines.push(`### ${title}`, '')

		if (description) {
			lines.push(description, '')
		}
	}

	return sendMarkdown(event, lines.join('\n'))
})
