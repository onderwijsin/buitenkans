import { queryCollection } from '@nuxt/content/server'

/**
 * Returns all markdown docs pages.
 *
 * @param event - H3 request event.
 * @returns Docs pages from Nuxt Content.
 */
export default defineEventHandler((event) => {
	return queryCollection(event, 'docs')
		.where('extension', '=', 'md')
		.where('path', 'NOT LIKE', '%/.navigation')
		.all()
})
