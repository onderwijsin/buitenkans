<script lang="ts" setup>
if (!import.meta.dev) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Pagina niet gevonden',
		fatal: import.meta.client
	})
}
</script>

<template>
	<div>
		<LandingReveal
			class="col-span-1 min-w-0 sm:col-span-2 md:min-h-68 lg:col-span-4"
			direction="up-right"
			:delay-ms="500"
		>
			<UPageCard
				class="h-full min-w-0 overflow-x-hidden"
				title="Een handreiking van het veld"
				description="Deze handreiking is ontwikkeld dóór en met het werkveld: een samenwerking tussen Onderwijsregio Oost-Nederland, Stichting Onderwijs in, hogescholen en landelijke partners."
			>
				<LogoCloud />
			</UPageCard>
		</LandingReveal>
	</div>
</template>
