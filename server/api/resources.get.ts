import { queryCollection } from '@nuxt/content/server'

/**
 * Returns docs pages from the `duik-dieper` section.
 *
 * @param event - H3 request event.
 * @returns Deep-dive resources from Nuxt Content.
 */
export default defineEventHandler((event) => {
	return queryCollection(event, 'docs')
		.where('extension', '=', 'md')
		.where('path', 'LIKE', '/docs/duik-dieper/%')
		.where('path', 'NOT LIKE', '%/.navigation')
		.all()
})
