<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

const containerRef = ref<HTMLElement | null>(null)

// reactive height
const { height } = useElementSize(containerRef)

// tweak this constant to match your desired feel
const SPEED_PER_PIXEL = 50

// computed animation speed
const speed = computed<number>(() => {
	if (!height.value) return 75000 // fallback
	return height.value * SPEED_PER_PIXEL
})
</script>

<template>
	<UMain>
		<PatternBackground
			ref="containerRef"
			class="flex h-auto w-full flex-col items-center justify-center"
			animate
			direction="bottom"
			variant="dot"
			mask="ellipse-top"
			size="md"
			:speed="speed"
		>
			<slot />
		</PatternBackground>
	</UMain>
</template>
