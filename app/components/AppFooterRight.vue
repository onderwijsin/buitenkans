<script setup lang="ts">
const appConfig = useAppConfig()

interface FooterLink {
	label?: string
	icon?: string
	to: string
	target: '_blank'
	'aria-label': string
}

const links = computed<FooterLink[]>(() => {
	const socialLinks = Object.entries(appConfig.socials || {}).flatMap(([key, url]) => {
		if (typeof url !== 'string' || !url) {
			return []
		}

		return [
			{
				icon: `i-simple-icons-${key}`,
				to: url,
				target: '_blank' as const,
				'aria-label': `${key} social link`
			}
		]
	})

	if (!appConfig.website) {
		return socialLinks
	}

	const websiteLink: FooterLink = {
		label: appConfig.website.label,
		to: appConfig.website.url,
		target: '_blank',
		'aria-label': 'Website link'
	}

	return [websiteLink, ...socialLinks]
})
</script>

<template>
	<template v-if="links">
		<UButton
			v-for="(link, index) of links"
			:key="index"
			size="sm"
			v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
		/>
	</template>
</template>
