<script lang="ts" setup>
import { kebabCase } from 'scule'

definePageMeta({
	layout: 'docs'
})

const { route, page, surround, headline, shouldHideToc } = await useDocsOverridePage({
	includeSurround: true
})

const { data: faqs } = await useAsyncData(`${kebabCase(route.path)}-faqs`, () =>
	queryCollection('faqs').select('title', 'description').all()
)
</script>

<template>
	<DocsOverridePage
		v-if="page"
		:page="page"
		:headline="headline"
		:should-hide-toc="shouldHideToc"
		body-class="mt-0"
	>
		<template #default>
			<UPageList divide>
				<UPageCard v-for="(faq, index) in faqs" :key="index" variant="ghost">
					<template #body>
						<UUser
							:name="faq.title"
							:description="faq.description"
							size="lg"
							:avatar="{ icon: 'lucide:message-circle-question-mark' }"
							:ui="{ root: 'items-start' }"
						/>
					</template>
				</UPageCard>
			</UPageList>
			<UContentSurround :surround="surround" />
		</template>
	</DocsOverridePage>
</template>
