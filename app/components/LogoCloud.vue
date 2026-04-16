<script lang="ts" setup>
/**
 * Logo type definition
 */
type Logo = {
	src: string
	alt: string
}

/**
 * Source logos
 */
const logos: Logo[] = [
	{ src: '/logos/archipel.png', alt: 'Archipel Scholen' },
	{ src: '/logos/ascenda.png', alt: 'Ascenda herregistratie' },
	{ src: '/logos/attendiz.png', alt: 'Attendiz' },
	{ src: '/logos/avs.png', alt: 'AVS academie' },
	{ src: '/logos/ijsselgraaf.png', alt: 'IJsselgraaf' },
	{ src: '/logos/iselinge.png', alt: 'Iselinge' },
	{ src: '/logos/keender.png', alt: 'Keender' },
	{ src: '/logos/kpz.png', alt: 'KPZ' },
	{ src: '/logos/lp.png', alt: 'LP' },
	{ src: '/logos/mijnplein.png', alt: 'Mijnplein' },
	{ src: '/logos/ocw.png', alt: 'OCW' },
	{ src: '/logos/onderwijsin.png', alt: 'OnderwijsIn' },
	{ src: '/logos/oponoa.png', alt: 'OPONOA' },
	{ src: '/logos/paraat.png', alt: 'Paraat' },
	{ src: '/logos/pon.png', alt: 'PON' },
	{ src: '/logos/poraad.png', alt: 'PO-Raad' },
	{ src: '/logos/pro.png', alt: 'PRO8' },
	{ src: '/logos/regio_on.png', alt: 'RegioON' },
	{ src: '/logos/regio_twente-eo.png', alt: 'Twente' },
	{ src: '/logos/saxion.png', alt: 'Saxion' },
	{ src: '/logos/skbg.svg', alt: 'SKBG' },
	{ src: '/logos/windesheim.svg', alt: 'Windesheim' }
]

/**
 * Offset helper to avoid mirrored symmetry between tracks
 *
 * @param arr - input array
 * @param offset - number of positions to rotate
 * @returns rotated array
 */
const offsetArray = <T,>(arr: T[], offset: number): T[] => {
	const normalized = offset % arr.length
	return [...arr.slice(normalized), ...arr.slice(0, normalized)]
}

/**
 * Right track is offset by ~1/3 for visual randomness
 */
const rightLogos = offsetArray(logos, Math.floor(logos.length / 3))
</script>

<template>
	<ClientOnly>
		<div class="grid gap-6">
			<!-- LEFT -->
			<UMarquee
				class="w-full min-w-0"
				:ui="{
					root: '[--duration:80s]',
					content: '!flex items-center gap-6'
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

			<!-- RIGHT (offset + reverse) -->
			<UMarquee
				reverse
				class="w-full min-w-0"
				:ui="{
					root: '[--duration:80s]',
					content: '!flex items-center gap-6'
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
	</ClientOnly>
</template>

<style scoped>
/* Prevent subtle flicker on some GPUs */
:deep(.u-marquee-content) {
	will-change: transform;
}
</style>
