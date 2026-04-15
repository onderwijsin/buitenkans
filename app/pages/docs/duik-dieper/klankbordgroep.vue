<script lang="ts" setup>
import type { ContentNavigationItem, DocsCollectionItem, PageCollections } from '@nuxt/content'
import type { OgImageComponents } from '#og-image/components'

import { findPageHeadline } from '@nuxt/content/utils'
import { kebabCase } from 'scule'

definePageMeta({
	layout: 'docs'
})

const route = useRoute()
const { locale, isEnabled } = useDocusI18n()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { shouldPushContent: shouldHideToc } = useAssistant()

const collectionName = computed(() => (isEnabled.value ? `docs_${locale.value}` : 'docs'))

const [{ data: page }, { data: people }, { data: surround }] = await Promise.all([
	useAsyncData(
		kebabCase(route.path),
		() =>
			queryCollection(collectionName.value as keyof PageCollections)
				.path(route.path)
				.first() as Promise<DocsCollectionItem>
	),
	useAsyncData(`people`, () =>
		queryCollection('people').select('name', 'job', 'employer', 'avatar').all()
	),
	useAsyncData(`${kebabCase(route.path)}-surround`, () => {
		return queryCollectionItemSurroundings(
			collectionName.value as keyof PageCollections,
			route.path,
			{
				fields: ['description']
			}
		).where('extension', '=', 'md')
	})
])

if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
const breadcrumbs = computed(() => findPageBreadcrumbs(navigation?.value, page.value?.path || ''))

useSeo({
	title,
	description,
	type: 'article',
	modifiedAt: (page.value as unknown as Record<string, unknown>).modifiedAt as string | undefined,
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
	description: formatOgDescription(title, description)
})

// Add the page path to the prerender list
addPrerenderPath(`/raw${route.path}.md`)
</script>

<template>
	<UPage v-if="page" :key="`page-${shouldHideToc}`">
		<UPageHeader
			:title="page.title"
			:description="page.description"
			:headline="headline"
			:ui="{
				wrapper: 'flex-row items-center flex-wrap justify-between'
			}"
		>
			<template #links>
				<UButton
					v-for="(link, index) in (page as DocsCollectionItem).links"
					:key="index"
					size="sm"
					v-bind="link"
				/>
			</template>
		</UPageHeader>

		<UPageBody class="mt-0">
			<UPageList divide>
				<UPageCard v-for="(person, index) in people" :key="index" variant="ghost">
					<template #body>
						<UUser
							:name="person.name"
							size="3xl"
							:avatar="{ src: person.avatar ?? undefined, icon: 'lucide:user' }"
							:ui="{ root: 'items-start', description: 'space-x-2' }"
						>
							<template #description>
								<span class="text-muted">
									{{ person.job }}
								</span>
								<UBadge
									v-if="person.employer"
									:label="person.employer"
									variant="soft"
									color="primary"
									size="sm"
									class="relative -top-px"
								/>
							</template>
						</UUser>
					</template>
				</UPageCard>
			</UPageList>
			<UContentSurround :surround="surround" />
		</UPageBody>

		<template #right> </template>
	</UPage>
</template>
