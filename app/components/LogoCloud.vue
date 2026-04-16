<script lang="ts" setup>
/**
 * Logo type definition.
 */
type Logo = {
	src: string
	alt: string
}

/**
 * Rotate an array by a fixed offset.
 *
 * @param items - Source array.
 * @param offset - Number of positions to rotate by.
 * @returns Rotated array.
 *
 * @example
 * const shifted = rotateArray([1, 2, 3, 4], 2)
 * // [3, 4, 1, 2]
 */
const rotateArray = <T,>(items: readonly T[], offset: number): T[] => {
	if (items.length === 0) {
		return []
	}

	const normalizedOffset = ((offset % items.length) + items.length) % items.length

	return [...items.slice(normalizedOffset), ...items.slice(0, normalizedOffset)]
}

const logos: Logo[] = [
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
	{ src: '/logos/onderwijsin.png', alt: 'Onderwijs in' },
	{ src: '/logos/oponoa.png', alt: 'Stichting OPONOA' },
	{ src: '/logos/paraat.png', alt: 'Paraat scholen' },
	{ src: '/logos/pon.png', alt: 'PON' },
	{ src: '/logos/poraad.png', alt: 'PO-Raad' },
	{ src: '/logos/pro.png', alt: 'PRO8' },
	{ src: '/logos/regio_on.png', alt: 'RegioON Onderwijsregio Oost-Nederland' },
	{ src: '/logos/regio_twente-eo.png', alt: 'Onderwijsregio Twente & Omstreken' },
	{ src: '/logos/saxion.png', alt: 'Saxion Hogeschool' },
	{ src: '/logos/skbg.svg', alt: 'SKBG' },
	{ src: '/logos/windesheim.svg', alt: 'Windesheim' }
]

/**
 * Offset the second track so both rows do not look weirdly mirrored.
 */
const rightLogos: Logo[] = rotateArray(logos, Math.floor(logos.length / 3))
</script>

<template>
	<div class="grid gap-6">
		<UMarquee
			:repeat="4"
			class="w-full min-w-0"
			:ui="{
				root: '[--duration:80s] [--gap:--spacing(6)]',
				content: '!w-auto !justify-start !items-center'
			}"
		>
			<div
				v-for="(logo, index) in logos"
				:key="`left-${index}`"
				class="flex h-16 w-[140px] shrink-0 items-center justify-center rounded-md bg-white p-4 dark:opacity-60"
			>
				<NuxtImg
					:src="logo.src"
					:alt="logo.alt"
					loading="eager"
					class="h-8 w-auto object-contain"
				/>
			</div>
		</UMarquee>

		<UMarquee
			reverse
			:repeat="4"
			class="w-full min-w-0"
			:ui="{
				root: '[--duration:80s] [--gap:--spacing(6)]',
				content: '!w-auto !justify-start !items-center'
			}"
		>
			<div
				v-for="(logo, index) in rightLogos"
				:key="`right-${index}`"
				class="flex h-16 w-[140px] shrink-0 items-center justify-center rounded-md bg-white p-4 dark:opacity-60"
			>
				<NuxtImg
					:src="logo.src"
					:alt="logo.alt"
					loading="eager"
					class="h-8 w-auto object-contain"
				/>
			</div>
		</UMarquee>
	</div>
</template>

<style scoped>
:deep(.u-marquee-content) {
	will-change: transform;
}
</style>
