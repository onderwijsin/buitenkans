export default defineAppConfig({
	docus: {
		locale: 'nl'
	},
	// @ts-expect-error this is fine
	github: false,
	assistant: {
		faqQuestions: [
			'How do I install Docus?',
			'How do I customize the theme?',
			'How do I add components to my pages?'
		]
	},
	ui: {
		colors: {
			primary: 'orange'
		},
		pageHero: {
			slots: {
				title: 'lg:text-5xl'
			}
		}
	}
})
