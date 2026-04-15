<template>
	<NuxtLayout name="default">
		<UContainer>
			<UPage
				:ui="{ root: 'lg:grid-cols-24', left: 'lg:col-span-5', center: 'lg:col-span-19' }"
			>
				<template #left>
					<UPageAside>
						<DocsAsideLeftTop />
						<DocsAsideLeftBody />
					</UPageAside>
				</template>
				<slot />
			</UPage>
		</UContainer>
	</NuxtLayout>
</template>
