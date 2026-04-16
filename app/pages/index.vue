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
	description: formatOgDescription(APP_IDENTITY.siteTitle, APP_IDENTITY.siteDescription),
	fontFamily: 'Poppins'
})

const insights: {
	title: string
	description: string
	to?: string
	image?: { light: string; dark: string }
	video?: string
}[] = [
	{
		title: 'Laat iedereen gericht oriënteren',
		description:
			'Goede oriëntatie is cruciaal voor zij-instromers en doorstromers. Bied een gedeelde basis, met differentiatie naar achtergrond en realistisch beeld van de rol.',
		to: '/docs/inzichten/gericht-orienteren',
		image: {
			light: '/graphics/gerichte_orientatie_light-mode.png',
			dark: '/graphics/gerichte_orientatie_dark-mode.png'
		}
	},
	{
		title: 'Selecteer op potentieel en perspectief',
		description:
			'Kijk verder dan geschiktheid en maak zichtbaar wat iemand al kan en nog moet ontwikkelen.',
		to: '/docs/inzichten/potentieel-en-perspectief',
		image: {
			light: '/graphics/perspectief_light-mode.png',
			dark: '/graphics/perspectief_dark-mode.png'
		}
	},
	{
		title: 'Ontwikkel leider én school',
		description:
			'Niet alleen de kandidaat ontwikkelt zich. Ook school en bestuur moeten verwachtingen expliciteren en ruimte maken voor nieuw leiderschap.',
		to: '/docs/inzichten/leider-en-school',
		image: {
			light: '/graphics/leider_en_school_light-mode.png',
			dark: '/graphics/leider_en_school_dark-mode.png'
		}
	},
	{
		title: 'Organiseer meerjarige begeleiding',
		description:
			'Begeleiding stopt niet na de opleiding. Coaching, nazorg en community zijn essentieel voor duurzaam succes.',
		video: 'Buitenkans_landing_en_begeleiding_yvlpmf.mp4'
	},
	{
		title: 'Faciliteer persoonlijke leerroutes',
		description:
			'Eén standaardtraject werkt niet. Maak modulaire opleidingsroutes die aansluiten op achtergrond, leerdoelen en ontwikkeltempo.',
		to: '/docs/inzichten/persoonlijke-leerroutes',
		image: {
			light: '/graphics/persoonlijke_leerroutes_light-mode.png',
			dark: '/graphics/persoonlijke_leerroutes_dark-mode.png'
		}
	},
	{
		title: 'Financier ook de oriëntatie',
		description:
			'Oriëntatie en selectie kosten tijd en geld. Maak deze fase onderdeel van het traject en onderzoek structurele financiering.',
		to: '/docs/inzichten/financier-orientatie',
		image: {
			light: '/graphics/financier_orientatie_light-mode.png',
			dark: '/graphics/financier_orientatie_dark-mode.png'
		}
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

const insightDirections = ['up', 'left', 'right', 'down', 'up-right', 'up-left'] as const

function insightDirection(index: number) {
	return insightDirections[index % insightDirections.length]
}

function insightGridClass(index: number) {
	return Math.floor(index / 2) % 2 === 0
		? index % 2 === 0
			? 'lg:col-span-4'
			: 'lg:col-span-2'
		: index % 2 === 0
			? 'lg:col-span-2'
			: 'lg:col-span-4'
}

function insightImageWidth(index: number) {
	return Math.floor(index / 2) % 2 === 0
		? index % 2 === 0
			? 'w-[85%]'
			: 'w-[60%]'
		: index % 2 === 0
			? 'w-[60%]'
			: 'w-[85%]'
}
</script>

<template>
	<div class="overflow-x-clip">
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
				<LandingReveal
					class="group col-span-1 sm:col-span-2"
					direction="left"
					:delay-ms="40"
				>
					<UPageCard class="h-full" spotlight>
						<template #title>
							Over <span class="text-primary">Buitenkans</span>
						</template>
						<template #description
							>Het project
							<NuxtLink
								class="text-highlighted font-medium underline"
								to="https://onderwijsin.nl/projecten/toekomst-maken-doe-je-samen-ook-in-schoolleiderschap"
								>Buitenkans</NuxtLink
							>
							verkent hoe we nieuwe routes naar schoolleiderschap ontwikkelen, met
							aandacht voor zij-instroom en doorstroom, en wat dit vraagt van
							besturen, opleidingen en scholen.</template
						>
						<UColorModeImage
							light="/graphics/buitenkans_light-mode.png"
							dark="/graphics/buitenkans_dark-mode.png"
							class="mx-auto w-[70%] py-8"
							alt="project Buitenkans"
						/>
					</UPageCard>
				</LandingReveal>

				<!-- CARD 2 -->
				<LandingReveal
					class="col-span-1 sm:col-span-2 lg:col-span-4"
					direction="right"
					:delay-ms="80"
				>
					<UPageCard
						class="h-full"
						spotlight
						title="Ervaringsdeskundigen staan centraal"
						description="Geleerde lessen uit wat bestuurders, opleiders en zij-instromers zelf vertellen."
					>
						<video
							class="rounded-md"
							controls
							loop
							playsinline
							src="https://res.cloudinary.com/onderwijsin/video/upload/q_auto/f_auto/w_1200/Buitenkans_de_meerwaarde_van_zijinstromende_schoolleider_rnjq8j.mp4"
							poster="https://res.cloudinary.com/onderwijsin/video/upload/so_10/q_auto/f_jpg/w_1200/Buitenkans_de_meerwaarde_van_zijinstromende_schoolleider_rnjq8j.mp4"
						/>
					</UPageCard>
				</LandingReveal>

				<!-- INSIGHTS -->
				<LandingReveal
					v-for="(card, i) in insights"
					:key="i"
					class="col-span-1 sm:col-span-2"
					:class="insightGridClass(i)"
					:direction="insightDirection(i)"
					:delay-ms="200"
				>
					<UPageCard
						class="h-full"
						spotlight
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
						<UColorModeImage
							v-if="card.image"
							v-bind="card.image"
							class="mx-auto py-8"
							:class="insightImageWidth(i)"
							:alt="card.title"
							loading="lazy"
						/>
						<video
							v-if="card.video"
							class="rounded-md"
							controls
							loop
							playsinline
							:src="`https://res.cloudinary.com/onderwijsin/video/upload/q_auto/f_auto/w_1200/${card.video}`"
							:poster="`https://res.cloudinary.com/onderwijsin/video/upload/so_5/q_auto/f_jpg/w_1200/${card.video}`"
						/>
					</UPageCard>
				</LandingReveal>

				<!-- CTA -->
				<LandingReveal class="col-span-1 sm:col-span-2" direction="up-left" :delay-ms="200">
					<UPageCard
						class="h-full"
						variant="subtle"
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
				</LandingReveal>

				<!-- PEOPLE AND ORGS -->
				<LandingReveal
					class="col-span-1 min-w-0 sm:col-span-2 md:min-h-68 lg:col-span-4"
					direction="up-right"
					:delay-ms="200"
				>
					<UPageCard
						class="h-full min-w-0 overflow-x-hidden"
						title="Een handreiking van het veld"
						description="Deze handreiking is ontwikkeld dóór en met het werkveld: een samenwerking tussen Onderwijsregio Oost-Nederland, Stichting Onderwijs in, hogescholen en landelijke partners."
					>
						<LogoCloud />
					</UPageCard>
				</LandingReveal>

				<LandingReveal
					class="col-span-1 min-w-0 sm:col-span-2 lg:col-span-6"
					direction="left"
					:delay-ms="200"
				>
					<UPageCard
						orientation="horizontal"
						title="Ontwikkelt binnen de Onderwijsregio Oost Nederland"
						:ui="{
							container: 'p-0 sm:p-0',
							wrapper: 'p-4 sm:p-6 gap-6',
							description: 'space-y-6'
						}"
						variant="subtle"
					>
						<template #leading>
							<NuxtImg src="/logos/regio_on.png" class="max-h-16" />
						</template>
						<template #description>
							<p>
								De inzichten in deze handreiking zijn voortgekomen uit het project
								Buitenkans, uitgevoerd in de Onderwijsregio Oost-Nederland. Deze
								regio een coöperatie van 52 schoolbesturen in het primair onderwijs
								en 6 hogescholen.
							</p>
							<UButton
								label="Ontdek de onderwijsregio"
								trailing-icon="lucide:arrow-up-right"
								size="sm"
								color="neutral"
								variant="subtle"
								to="https://regioon.nl/"
							/>
						</template>
						<div
							class="grid h-full w-full place-items-center bg-[#E7ECF3] sm:py-8 dark:bg-neutral-950/50"
						>
							<NuxtImg src="regioon.webp" class="mx-auto max-h-80 dark:opacity-70" />
						</div>
					</UPageCard>
				</LandingReveal>
			</UPageGrid>
		</UPageSection>
	</div>
</template>
