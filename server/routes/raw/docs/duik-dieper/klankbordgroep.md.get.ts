import { queryCollection } from '@nuxt/content/server'
import {
	createPageIntroMarkdown,
	getDocsPageOr404,
	sendMarkdown
} from '~~/server/utils/raw-markdown'
import { defineEventHandler } from 'h3'

type Person = {
	name?: string | null
	job?: string | null
	employer?: string | null
}

export default defineEventHandler(async (event) => {
	const [page, people] = await Promise.all([
		getDocsPageOr404(event, '/docs/duik-dieper/klankbordgroep'),
		queryCollection(event, 'people').select('name', 'job', 'employer').all() as Promise<
			Person[]
		>
	])

	const lines = [createPageIntroMarkdown(page), '', '## Klankbordgroep', '']

	if (!people.length) {
		lines.push('Geen leden gevonden.')
		return sendMarkdown(event, lines.join('\n'))
	}

	for (const person of people) {
		const name = person.name?.trim() || 'Onbekend'
		const job = person.job?.trim()
		const employer = person.employer?.trim()
		const meta = [job, employer].filter(Boolean).join(' · ')

		lines.push(`### ${name}`, '')

		if (meta) {
			lines.push(meta, '')
		}
	}

	return sendMarkdown(event, lines.join('\n'))
})
