<script lang="ts" setup>
import type { PageCollections } from '@nuxt/content'

import { kebabCase } from 'scule'

definePageMeta({
	layout: 'docs'
})

const { route, page, headline, shouldHideToc, docsCollectionKey } = await useDocsOverridePage()

const { data: cards } = await useAsyncData(`${kebabCase(route.path)}-cards`, () =>
	queryCollection(docsCollectionKey.value as keyof PageCollections)
		.select('navigation', 'title', 'description', 'path')
		.andWhere((query) =>
			query
				.where('extension', '=', 'md')
				.where('stem', 'LIKE', `%1.inzichten%`)
				.where('stem', 'NOT LIKE', `%00.overzicht%`)
		)
		.all()
)

function getNavigationIcon(navigationItem: PageCollections['docs']['navigation']) {
	if (!navigationItem || typeof navigationItem !== 'object') {
		return null
	}
	return navigationItem.icon ?? null
}
</script>

<template>
	<DocsOverridePage
		v-if="page"
		:page="page"
		:headline="headline"
		:should-hide-toc="shouldHideToc"
	>
		<div class="my-0 grid w-full gap-6">
			<UPageCard
				v-for="card in cards"
				:key="card.path"
				:icon="getNavigationIcon(card.navigation)"
				:title="card.title"
				:description="card.description"
				:to="card.path"
				spotlight
				spotlight-color="primary"
			/>
		</div>
	</DocsOverridePage>
</template>
