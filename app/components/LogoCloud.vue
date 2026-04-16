<script lang="ts" setup>
type Logo = { src: string; alt: string }

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

/**
 * Splits logos into two equal-length arrays for marquee usage.
 * If uneven, duplicates last item from the longer side.
 *
 * @param logos - Full logo list
 * @returns Object containing left and right marquee arrays
 *
 * @example
 * const { left, right } = splitLogosEvenly(logos)
 */
const splitLogosEvenly = (logos: Logo[]): { left: Logo[]; right: Logo[] } => {
	const left: Logo[] = []
	const right: Logo[] = []

	// Split
	logos.forEach((logo, index) => {
		if (index % 2 === 0) {
			left.push(logo)
		} else {
			right.push(logo)
		}
	})

	// Normalize lengths
	if (left.length > right.length) {
		// duplicate last from left → right
		right.push(left[left.length - 1]!)
	} else if (right.length > left.length) {
		// duplicate last from right → left
		left.push(right[right.length - 1]!)
	}

	return { left, right }
}

// Split logos in even arrays for left and right marquee
const { left: leftMarquee, right: rightMarquee } = splitLogosEvenly(logos)
</script>

<template>
	<div class="grid">
		<UMarquee
			class="w-full min-w-0"
			:ui="{ root: '[--duration:30s]', content: '!justify-start !w-max' }"
		>
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
		<UMarquee
			reverse
			class="w-full min-w-0"
			:ui="{ root: '[--duration:30s]', content: '!justify-start !w-max' }"
		>
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
	</div>
</template>
