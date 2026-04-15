<template>
	<div>
		<PatternBackground
			class="fixed! z-0 h-screen w-screen"
			animate
			direction="bottom"
			variant="dot"
			mask="ellipse-top"
			size="md"
			:speed="25000"
		/>
		<UMain class="relative" style="z-index: 1">
			<slot />
		</UMain>
	</div>
</template>
