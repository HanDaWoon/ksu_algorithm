/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'class', // or 'media' or 'class
	theme: {
		extend: {
			colors: {
				'cornflower-blue': {
					50: '#ecf1ff',
					100: '#dde4ff',
					200: '#c2ceff',
					300: '#9cacff',
					400: '#757fff',
					500: '#6666ff',
					600: '#4536f5',
					700: '#3b2ad8',
					800: '#3025ae',
					900: '#2b2689',
					950: '#1b1650'
				},
				'red-orange': {
					50: '#fff1f1',
					100: '#ffdfdf',
					200: '#ffc5c5',
					300: '#ff9d9d',
					400: '#ff6464',
					500: '#ff2e2e',
					600: '#ed1515',
					700: '#c80d0d',
					800: '#a50f0f',
					900: '#881414',
					950: '#4b0404'
				},
				'dodger-blue': {
					50: '#eef8ff',
					100: '#d9eeff',
					200: '#bce1ff',
					300: '#8dd0ff',
					400: '#58b3ff',
					500: '#3193ff',
					600: '#277bf6',
					700: '#135ce2',
					800: '#164bb7',
					900: '#184290',
					950: '#142957'
				}
			}
		}
	},
	plugins: [
		require('flowbite/plugin'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography')
	]
};
