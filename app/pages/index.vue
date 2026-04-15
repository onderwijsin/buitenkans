<script lang="ts" setup>
import type { OgImageComponents } from '#og-image/components'

import { APP_IDENTITY } from '@constants'

useSeo({
	title: APP_IDENTITY.siteTitle,
	description: APP_IDENTITY.siteDescription,
	type: 'website'
})

defineOgImage('Docs' as keyof OgImageComponents, {
	headline: 'Handreiking',
	title: APP_IDENTITY.siteTitle?.slice(0, 60),
	description: formatOgDescription(APP_IDENTITY.siteTitle, APP_IDENTITY.siteDescription)
})

const insights: { title: string; description: string; to: string }[] = [
	{
		title: 'Laat iedereen gericht oriënteren',
		description:
			'Goede oriëntatie is cruciaal voor zij-instromers en doorstromers. Bied een gedeelde basis, met differentiatie naar achtergrond en realistisch beeld van de rol.',
		to: '/docs/inzichten/gericht-orienteren'
	},
	{
		title: 'Selecteer op potentieel en perspectief',
		description:
			'Kijk verder dan geschiktheid en maak zichtbaar wat iemand al kan en nog moet ontwikkelen.',
		to: '/docs/inzichten/potentieel-en-perspectief'
	},
	{
		title: 'Ontwikkel leider én school',
		description:
			'Niet alleen de kandidaat ontwikkelt zich. Ook school en bestuur moeten verwachtingen expliciteren en ruimte maken voor nieuw leiderschap.',
		to: '/docs/inzichten/leider-en-school'
	},
	{
		title: 'Organiseer meerjarige begeleiding',
		description:
			'Begeleiding stopt niet na de opleiding. Coaching, nazorg en community zijn essentieel voor duurzaam succes.',
		to: '/docs/inzichten/meerjarige-begeleiding'
	},
	{
		title: 'Faciliteer persoonlijke leerroutes',
		description:
			'Eén standaardtraject werkt niet. Maak modulaire opleidingsroutes die aansluiten op achtergrond, leerdoelen en ontwikkeltempo.',
		to: '/docs/inzichten/persoonlijke-leerroutes'
	},
	{
		title: 'Financier ook de oriëntatie',
		description:
			'Oriëntatie en selectie kosten tijd en geld. Maak deze fase onderdeel van het traject en onderzoek structurele financiering.',
		to: '/docs/inzichten/financier-orientatie'
	}
]

const countMap = {
	0: 'eerste',
	1: 'tweede',
	2: 'derde',
	3: 'vierde',
	4: 'vijfde',
	5: 'zesde',
	6: 'zevende',
	7: 'achtste',
	8: 'negende',
	9: 'tiende'
}
function insightCountLabel(index: number) {
	const modifier = countMap[index as keyof typeof countMap] ?? `${index + 1}e`

	return `het ${modifier} inzicht`
}
</script>

<template>
	<div>
		<UPageHero
			:ui="{
				container: 'pb-0 sm:pb-0 md:pb-0 lg:pb-0',
				title: 'leading-snug text-pretty'
			}"
		>
			<template #headline>
				<UButton
					icon="lucide:sparkles"
					size="sm"
					to="https://onderwijsin.nl"
					variant="outline"
				>
					Ontdek Onderwijs in →
				</UButton>
			</template>
			<template #title>
				Samen bouwen aan routes voor
				<span class="text-primary">leiders in het onderwijs</span>
			</template>
			<template #description>
				Deze digitale handreiking bevat inzichten en concrete acties voor schoolbesturen,
				opleidingen en onderwijsregio’s om
				<strong>schoolleiders van buiten</strong> hun route te laten vinden en voltooien.
			</template>
			<template #links>
				<UButton
					color="neutral"
					size="xl"
					to="docs/inzichten/overzicht"
					trailing-icon="i-lucide-arrow-right"
				>
					Ontdek de inzichten
				</UButton>

				<UButton
					color="neutral"
					icon="lucide:info"
					size="xl"
					to="docs/duik-dieper/achtergrond"
					variant="outline"
				>
					Over deze handreiking
				</UButton>
			</template>
		</UPageHero>

		<!-- SECTION -->
		<UPageSection>
			<UPageGrid class="lg:grid-cols-6">
				<!-- CARD 1 -->
				<UPageCard spotlight class="group col-span-2">
					<template #title> Over <span class="text-primary">Buitenkans</span> </template>
					<template #description
						>Het project
						<NuxtLink
							class="text-highlighted font-medium underline"
							to="https://onderwijsin.nl/projecten/toekomst-maken-doe-je-samen-ook-in-schoolleiderschap"
							>Buitenkans</NuxtLink
						>
						verkent hoe we nieuwe routes naar schoolleiderschap ontwikkelen, met
						aandacht voor zij-instroom en doorstroom, en wat dit vraagt van besturen,
						opleidingen en scholen.</template
					>
					<!-- <FloatingNuxt /> -->
				</UPageCard>

				<!-- CARD 2 -->
				<UPageCard
					spotlight
					class="col-span-2 lg:col-span-4"
					title="Ervaringsdeskundigen staan centraal"
					description="Geleerde lessen uit wat bestuurders, opleiders en zij-instromers zelf vertellen."
				>
					<video
						class="rounded-md"
						controls
						loop
						playsinline
						src="https://res.cloudinary.com/nuxt/video/upload/v1767647099/studio/studio-demo_eiofld.mp4"
					/>
				</UPageCard>

				<!-- INSIGHTS -->
				<UPageCard
					v-for="(card, i) in insights"
					:key="i"
					spotlight
					class="col-span-2"
					:class="[
						Math.floor(i / 2) % 2 === 0
							? i % 2 === 0
								? 'lg:col-span-4'
								: 'lg:col-span-2' // [4,2]
							: i % 2 === 0
								? 'lg:col-span-2'
								: 'lg:col-span-4' // [2,4]
					]"
					:title="card.title"
					:description="card.description"
					:to="card.to"
				>
					<template #leading>
						<UBadge
							size="sm"
							color="primary"
							variant="subtle"
							icon="lucide:lightbulb"
							:label="insightCountLabel(i)"
						/>
					</template>
				</UPageCard>

				<!-- CTA -->
				<UPageCard
					variant="subtle"
					class="col-span-2"
					title="Aan de slag!"
					description="Ontdek alle inzichten, lessen, handige tips en tools die Buitenkans heeft opgeleverd."
				>
					<div class="mx-auto flex w-full max-w-xs flex-col gap-3 text-center">
						<UButton
							block
							color="primary"
							size="lg"
							to="/docs/inzichten/overzicht"
							trailing-icon="i-lucide-arrow-right"
						>
							Ontdek de inzichten
						</UButton>

						<UButton
							block
							color="neutral"
							icon="lucide:info"
							size="lg"
							to="/docs/duik-dieper/achtergrond"
							target="_blank"
							variant="outline"
						>
							Over deze handreiking
						</UButton>
					</div>
				</UPageCard>

				<!-- PEOPLE AND ORGS -->
				<UPageCard
					class="col-span-2 md:min-h-68 lg:col-span-4"
					title="Een handreiking van het veld"
					description="Deze handreiking is ontwikkeld dóór en met het werkveld: een samenwerking tussen Onderwijsregio Oost-Nederland, Stichting Onderwijs in, hogescholen en landelijke partners."
				>
					<UMarquee>
						<UIcon name="i-simple-icons-github" class="size-10 shrink-0" />
						<UIcon name="i-simple-icons-discord" class="size-10 shrink-0" />
						<UIcon name="i-simple-icons-x" class="size-10 shrink-0" />
						<UIcon name="i-simple-icons-instagram" class="size-10 shrink-0" />
						<UIcon name="i-simple-icons-linkedin" class="size-10 shrink-0" />
						<UIcon name="i-simple-icons-facebook" class="size-10 shrink-0" />
					</UMarquee>
				</UPageCard>
			</UPageGrid>
		</UPageSection>
	</div>
</template>
