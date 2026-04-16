<script lang="ts" setup>
import { kebabCase } from 'scule'

definePageMeta({
	layout: 'docs'
})

const { route, page, surround, headline, shouldHideToc } = await useDocsOverridePage({
	includeSurround: true
})

const { data: people } = await useAsyncData(`${kebabCase(route.path)}-people`, () =>
	queryCollection('people').select('name', 'job', 'employer', 'avatar').all()
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
		</template>
	</DocsOverridePage>
</template>
