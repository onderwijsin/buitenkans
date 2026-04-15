import type { H3Event } from 'h3'

import { queryCollection } from '@nuxt/content/server'
import { createError, setHeader } from 'h3'

type DocsPageLink = {
	label?: string | null
	to?: string | null
}

type DocsPage = {
	title?: string | null
	description?: string | null
	seo?: {
		title?: string | null
		description?: string | null
	} | null
	links?: DocsPageLink[] | null
}

/**
 * Load a docs page by route path and fail with 404 when it doesn't exist.
 *
 * @param event - Request event used by Nuxt Content query helpers.
 * @param path - Canonical docs route path (for example `/docs/inzichten/overzicht`).
 * @returns Docs page payload with title/description/link metadata.
 */
export async function getDocsPageOr404(event: H3Event, path: string) {
	const page = (await queryCollection(event, 'docs').path(path).first()) as DocsPage | null

	if (!page) {
		throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
	}

	return page
}

/**
 * Build the shared intro block used by raw markdown routes:
 * title/description and optional page links from frontmatter.
 *
 * @param page - Docs page metadata loaded from the `docs` collection.
 * @returns Markdown intro block.
 */
export function createPageIntroMarkdown(page: DocsPage) {
	const title = page.seo?.title || page.title || ''
	const description = page.seo?.description || page.description || ''
	const lines: string[] = []

	if (title) {
		lines.push(`# ${title}`, '')
	}

	if (description) {
		lines.push(description, '')
	}

	const links =
		page.links
			?.filter((link) => link?.label && link?.to)
			.map((link) => `- [${link.label}](${link.to})`) ?? []

	if (links.length > 0) {
		lines.push('## Snelle links', '', ...links, '')
	}

	return lines.join('\n').trim()
}

/**
 * Return markdown with the proper response content-type.
 *
 * @param event - Current request event.
 * @param markdown - Markdown body to return.
 * @returns Final markdown response payload.
 */
export function sendMarkdown(event: H3Event, markdown: string) {
	setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
	return markdown.endsWith('\n') ? markdown : `${markdown}\n`
}
