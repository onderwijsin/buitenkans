<script lang="ts" setup>
definePageMeta({
	layout: 'docs'
})

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
	return queryCollection('faqs').path(route.path).first()
})

if (!page.value) {
	// Handle page not found
	throw createError({
		statusCode: 404,
		statusMessage: 'Item niet gevonden',
		fatal: true
	})
}
const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
	return queryCollectionItemSurroundings('faqs', route.path, {
		fields: ['description']
	})
})
</script>

<template>
	<UPage v-if="page">
		<UPageHeader
			:title="page.title"
			:description="page.description"
			headline="Veelgestelde vragen"
			:ui="{
				wrapper: 'flex-row items-center flex-wrap justify-between'
			}"
		/>
		<div class="space-y-8 py-8 pt-16">
			<UContentSurround :surround="surround" />
		</div>
	</UPage>
</template>
