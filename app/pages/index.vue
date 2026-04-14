<script lang="ts" setup>
import { siteDescription, siteTitle } from '~~/config/identity'

useSeoMeta({
	title: siteTitle,
	description: siteDescription,
	ogTitle: siteTitle,
	ogDescription: siteDescription
})
</script>

<template>
	<NuxtLayout name="docs"><h1>The docs!</h1></NuxtLayout>
</template>
