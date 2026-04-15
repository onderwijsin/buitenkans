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

const logos: { src: string; alt: string }[] = [
	{ src: '/logos/archipel.png', alt: 'Archipel Scholen' },
	{ src: '/logos/ascenda.png', alt: 'Ascenda herregistratie' },
	{ src: '/logos/attendiz.png', alt: 'Attendiz' },
	{ src: '/logos/avs.png', alt: 'AVS academie & vakvereniging schoolleiders' },
	{ src: '/logos/ijsselgraaf.png', alt: 'IJsselgraaf' },
	{ src: '/logos/iselinge.png', alt: 'Iselinge Hogeschool' },
	{ src: '/logos/keender.png', alt: 'Keender' },
	{ src: '/logos/kpz.png', alt: 'Hogeschool KPZ' },
	{ src: '/logos/lp.png', alt: 'LP' },
	{ src: '/logos/mijnplein.png', alt: 'Mijnplein' },
	{ src: '/logos/ocw.png', alt: 'Ministerie van Onderwijs, Cultuur en Wetenschap' },
	{ src: '/logos/onderwijs_specialisten.png', alt: 'De Onderwijs Specialisten' },
	{ src: '/logos/onderwijsin.png', alt: 'OnderwijsIn' },
	{ src: '/logos/oponoa.png', alt: 'Stichting OPONOA' },
	{ src: '/logos/paraat.png', alt: 'Paraat scholen' },
	{ src: '/logos/pon.png', alt: 'PON' },
	{ src: '/logos/poraad.png', alt: 'PO-Raad' },
	{ src: '/logos/pro.png', alt: 'PRO8' },
	{ src: '/logos/regio_on.png', alt: 'RegioON Onderwijsregio Oost-Nederland' },
	{ src: '/logos/regio_twente-eo.png', alt: 'Onderwijsregio Twente & Omstreken' },
	{ src: '/logos/samen_sopo.png', alt: 'Samen SopoW' },
	{ src: '/logos/saxion.png', alt: 'Saxion Hogeschool' },
	{ src: '/logos/sg_veluwezoom.png', alt: 'Scholengroep Veluwezoom' },
	{ src: '/logos/skbg.svg', alt: 'SKBG' },
	{
		src: '/logos/ssotog.png',
		alt: 'SOTOG Stichting Speciaal Onderwijs Twente en Oost Gelderland'
	},
	{ src: '/logos/tof.png', alt: 'TOF Onderwijs' },
	{ src: '/logos/windesheim.svg', alt: 'Windesheim' },
	{ src: '/logos/zwolle.png', alt: 'Onderwijsregio Zwolle en omgeving' }
]

// Split logos in even arrays for left and right marquee

const leftMarquee = logos.filter((_, index) => index % 2 === 0)
const rightMarquee = logos.filter((_, index) => index % 2 !== 0)

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
				<LandingReveal class="group col-span-2" direction="left" :delay-ms="40">
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
				<LandingReveal class="col-span-2 lg:col-span-4" direction="right" :delay-ms="80">
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
					class="col-span-2"
					:class="insightGridClass(i)"
					:direction="insightDirection(i)"
					:delay-ms="120 + i * 45"
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
				<LandingReveal class="col-span-2" direction="up-left" :delay-ms="440">
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
					class="col-span-2 md:min-h-68 lg:col-span-4"
					direction="up-right"
					:delay-ms="500"
				>
					<UPageCard
						class="h-full"
						title="Een handreiking van het veld"
						description="Deze handreiking is ontwikkeld dóór en met het werkveld: een samenwerking tussen Onderwijsregio Oost-Nederland, Stichting Onderwijs in, hogescholen en landelijke partners."
					>
						<UMarquee :ui="{ root: '[--duration:30s]' }">
							<div
								v-for="(logo, index) in leftMarquee"
								:key="index"
								class="grid rounded-md bg-white p-4 dark:opacity-60"
							>
								<NuxtImg
									:src="logo.src"
									:alt="logo.alt"
									loading="lazy"
									class="h-8 w-auto object-contain object-center"
								/>
							</div>
						</UMarquee>
						<UMarquee reverse :ui="{ root: '[--duration:30s]' }">
							<div
								v-for="(logo, index) in rightMarquee"
								:key="index"
								class="grid rounded-md bg-white p-4 dark:opacity-60"
							>
								<NuxtImg
									:src="logo.src"
									:alt="logo.alt"
									loading="lazy"
									class="h-8 w-auto object-contain object-center"
								/>
							</div>
						</UMarquee>
					</UPageCard>
				</LandingReveal>
			</UPageGrid>
		</UPageSection>
	</div>
</template>
