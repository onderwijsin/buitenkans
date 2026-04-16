<script lang="ts" setup>
import type { DocsCollectionItem } from '@nuxt/content'

const props = defineProps<{
	page: DocsCollectionItem
	headline?: string | null
	shouldHideToc?: boolean
	bodyClass?: string
}>()
</script>

<template>
	<UPage :key="`page-${props.shouldHideToc ? 'hidden' : 'visible'}`">
		<UPageHeader
			:title="props.page.title"
			:description="props.page.description"
			:headline="props.headline || undefined"
			:ui="{
				wrapper: 'flex-row items-center flex-wrap justify-between'
			}"
		>
			<template #links>
				<UButton
					v-for="(link, index) in props.page.links"
					:key="index"
					size="sm"
					v-bind="link"
				/>
			</template>
		</UPageHeader>

		<UPageBody :class="props.bodyClass">
			<slot />
		</UPageBody>

		<template #right>
			<slot name="right" />
		</template>
	</UPage>
</template>
