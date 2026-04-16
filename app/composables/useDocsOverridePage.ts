import type { ContentNavigationItem, DocsCollectionItem, PageCollections } from '@nuxt/content'
import type { OgImageComponents } from '#og-image/components'

import { findPageHeadline } from '@nuxt/content/utils'
import { kebabCase } from 'scule'

type UseDocsOverridePageOptions = {
	includeSurround?: boolean
}

/**
 * Shared bootstrap for custom docs override pages.
 *
 * Loads the current docs page, configures SEO/OG metadata, computes headline/breadcrumbs,
 * optionally loads surround navigation items, and registers the corresponding raw markdown path
 * for prerendering.
 *
 * @param options - Per-page options (for example, enabling surround navigation queries).
 * @returns Shared route/page refs and docs collection context for override pages.
 */
export async function useDocsOverridePage(options: UseDocsOverridePageOptions = {}) {
	const { includeSurround = false } = options

	const route = useRoute()
	const { locale, isEnabled } = useDocusI18n()
	const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
	const { shouldPushContent: shouldHideToc } = useAssistant()

	const docsCollectionKey = computed<keyof PageCollections>(() =>
		isEnabled.value ? (`docs_${locale.value}` as keyof PageCollections) : 'docs'
	)

	const { data: page } = await useAsyncData(
		kebabCase(route.path),
		() =>
			queryCollection(docsCollectionKey.value)
				.path(route.path)
				.first() as Promise<DocsCollectionItem>
	)

	if (!page.value) {
		throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
	}

	const { data: surround } = await useAsyncData(
		`${kebabCase(route.path)}-surround`,
		() =>
			queryCollectionItemSurroundings(docsCollectionKey.value, route.path, {
				fields: ['description']
			}).where('extension', '=', 'md'),
		{
			immediate: includeSurround
		}
	)

	const title = page.value.seo?.title || page.value.title
	const description = page.value.seo?.description || page.value.description

	const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
	const breadcrumbs = computed(() =>
		findPageBreadcrumbs(navigation?.value, page.value?.path || '')
	)

	useSeo({
		title,
		description,
		type: 'article',
		modifiedAt: (page.value as unknown as Record<string, unknown>).modifiedAt as
			| string
			| undefined,
		breadcrumbs
	})

	watch(
		() => navigation?.value,
		() => {
			headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
		}
	)

	defineOgImage('Docs' as keyof OgImageComponents, {
		headline: headline.value,
		title: title?.slice(0, 60),
		description: formatOgDescription(title, description),
		fontFamily: 'Poppins'
	})

	addPrerenderPath(`/raw${route.path}.md`)

	return {
		route,
		page,
		surround,
		headline,
		shouldHideToc,
		docsCollectionKey
	}
}
