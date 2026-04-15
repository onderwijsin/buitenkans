/**
 * Keep UI overrides in a variable instead of an inline literal.
 *
 * Why:
 * - Nuxt-generated app config types can be narrower than what Docus/Nuxt UI accepts at runtime.
 * - Defining this object separately avoids fragile excess-property checks in `defineAppConfig(...)`.
 */
const uiConfig = {
	colors: {
		primary: 'orange'
	},
	pageHero: {
		slots: {
			title: 'text-3xl sm:text-4xl md:text-6xl lg:text-5xl'
		}
	},
	page: {
		slots: {
			center: 'lg:col-span-7',
			right: 'lg:col-span-3'
		}
	},
	pageHeader: {
		slots: {
			wrapper: 'lg:flex-nowrap lg:items-start'
		}
	},
	contentToc: {
		slots: {
			root: 'bg-default/75 backdrop-blur lg:bg-transparent lg:backdrop-blur-none'
		}
	}
}

export default defineAppConfig({
	docus: {
		locale: 'nl'
	},

	/**
	 * Must stay `false` at runtime.
	 *
	 * Why:
	 * - Docus app components use a truthy check for `appConfig.github` to decide whether to render
	 *   GitHub links/actions.
	 * - This project intentionally disables all GitHub UI affordances.
	 * - Current generated AppConfig typing expects an object shape, so we bridge that mismatch with a
	 *   boundary cast while preserving the runtime boolean value.
	 */
	github: false as unknown as { url?: string; branch?: string; rootDir?: string },
	assistant: {
		faqQuestions: [
			{
				category: 'Algemeen',
				items: ['Wat is Buitenkans?', 'Door wie is Buitenkans ontwikkeld?']
			},
			{
				category: 'Strategie',
				items: [
					'Waarom investeren in een schoolleiderstraject?',
					'Kiezen voor zij-instromers of doorstromers?',
					'Zelf doen of regionaal samenwerken?'
				]
			},
			{
				category: 'Ontwerp',
				items: [
					'Hoe richten we selectie in?',
					'Hoe bouwen we een flexibel traject?',
					'Hoe organiseren we de oriëntatiefase?'
				]
			},
			{
				category: 'Uitvoering',
				items: [
					'Hoe begeleiden we na de start?',
					'Wat vraagt dit van onze scholen?',
					'Welke randvoorwaarden zijn nodig?'
				]
			}
		]
	},
	header: {
		title: 'Buitenkans',
		logo: {
			light: '/logo_light-mode.png',
			dark: '/logo_dark-mode.png',
			alt: 'Buitenkans Logo',
			favicon: '/favicon.ico',
			class: 'h-8'
		}
	},
	socials: {
		linkedin: 'https://www.linkedin.com/company/onderwijs-in',
		github: 'https://github.com/onderwijsin'
	},
	website: {
		url: 'https://onderwijsin.nl',
		label: 'onderwijsin.nl'
	},
	toc: {
		bottom: {
			title: 'Auteurs',
			links: [
				{
					label: 'Onderwijsregio Oost Nederland',
					to: 'https://regioon.nl/',
					target: '_blank',
					class: 'text-xs'
				},
				{
					label: 'Stichting Onderwijs in',
					to: 'https://onderwijsin.nl',
					target: '_blank',
					class: 'text-xs'
				}
			]
		}
	},
	ui: uiConfig
})
