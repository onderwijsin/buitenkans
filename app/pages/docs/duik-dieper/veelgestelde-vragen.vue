<script lang="ts" setup>
import { kebabCase } from 'scule'

definePageMeta({
	layout: 'docs'
})

const { route, page, surround, headline, shouldHideToc } = await useDocsOverridePage({
	includeSurround: true
})

const { data: faqs } = await useAsyncData(`${kebabCase(route.path)}-faqs`, () =>
	queryCollection('faqs').select('title', 'description', 'audience', 'tags', 'related').all()
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
						<div class="flex gap-3">
							<div
								class="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-950"
							>
								<UIcon
									name="lucide:message-circle-question-mark"
									class="text-muted size-4"
								/>
							</div>
							<div class="space-y-2">
								<h3 class="mt-1 text-lg font-bold">{{ faq.title }}</h3>
								<p class="text-muted text-sm">{{ faq.description }}</p>
								<div class="space-x-2">
									<UBadge
										v-for="item in faq.tags"
										:key="item"
										color="primary"
										variant="subtle"
										icon="lucide:tag"
										:label="item"
										size="sm"
									/>
								</div>
							</div>
						</div>
					</template>
				</UPageCard>
			</UPageList>
			<UContentSurround :surround="surround" />
		</template>
	</DocsOverridePage>
</template>
