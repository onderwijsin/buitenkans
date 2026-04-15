<script setup lang="ts">
type RevealDirection =
	| 'up'
	| 'down'
	| 'left'
	| 'right'
	| 'up-left'
	| 'up-right'
	| 'down-left'
	| 'down-right'

interface LandingRevealProps {
	direction?: RevealDirection
	delayMs?: number
	durationMs?: number
	distance?: number
}

const props = withDefaults(defineProps<LandingRevealProps>(), {
	direction: 'up',
	delayMs: 0,
	durationMs: 650,
	distance: 10
})

const targetRef = ref<HTMLElement | null>(null)
const reducedMotion = usePreferredReducedMotion()

const isVisible = useElementVisibility(targetRef, {
	threshold: 0.2
})

const hiddenTransform = computed(() => {
	const distance = props.distance

	switch (props.direction) {
		case 'up':
			return `translate3d(0, ${distance}px, 0)`
		case 'down':
			return `translate3d(0, -${distance}px, 0)`
		case 'left':
			return `translate3d(${distance}px, 0, 0)`
		case 'right':
			return `translate3d(-${distance}px, 0, 0)`
		case 'up-left':
			return `translate3d(${distance}px, ${distance}px, 0)`
		case 'up-right':
			return `translate3d(-${distance}px, ${distance}px, 0)`
		case 'down-left':
			return `translate3d(${distance}px, -${distance}px, 0)`
		case 'down-right':
			return `translate3d(-${distance}px, -${distance}px, 0)`
		default:
			return `translate3d(0, ${distance}px, 0)`
	}
})

const revealStyle = computed(() => {
	if (reducedMotion.value === 'reduce') {
		return { opacity: '1' }
	}

	return {
		opacity: isVisible.value ? '1' : '0',
		transform: isVisible.value ? 'translate3d(0, 0, 0)' : hiddenTransform.value,
		filter: isVisible.value ? 'blur(0px)' : 'blur(3px)',
		transitionProperty: 'transform, opacity, filter',
		transitionDuration: `${props.durationMs}ms`,
		transitionDelay: `${props.delayMs}ms`,
		transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
		willChange: 'transform, opacity, filter'
	}
})
</script>

<template>
	<div ref="targetRef" class="h-full" :style="revealStyle">
		<slot />
	</div>
</template>
