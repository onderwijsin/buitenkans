<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
	return queryCollection('items').path(route.path).first()
})

if (!page.value) {
	// Handle page not found
	throw createError({
		statusCode: 404,
		statusMessage: 'Item niet gevonden',
		fatal: true
	})
}

// useSeoMeta({
// 	title: `${page.value.title} | ${page.value.pillar}`,
// 	description: page.value.description,
// 	ogTitle: `${page.value.title} | ${page.value.pillar}`,
// 	ogDescription: page.value.description
// })

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
	return queryCollectionItemSurroundings('items', route.path, {
		fields: ['description']
	})
})
</script>

<template>
	<NuxtLayout v-if="page" name="menu">
		<UPageHeader
			:title="page.title"
			headline="headline"
			:ui="{
				root: 'pt-2',
				wrapper: 'items-start lg:items-start'
			}"
		>
			<template #description>
				<p class="text-muted my-4 text-lg text-pretty">{{ page.description }}</p>
				<div class="space-x-2">badges</div>
			</template>
			<template #links>
				<PageHeaderLinks />
			</template>
		</UPageHeader>
		<ContentRenderer v-if="page" :value="page" />
		<div class="space-y-8 pt-16 pb-8">
			<USeparator label="Ontdek meer inzichten" />
			<UContentSurround :surround="surround" />
		</div>
	</NuxtLayout>
</template>
