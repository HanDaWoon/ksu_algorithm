/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
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
				'pastel-green': {
					50: '#f1fdf0',
					100: '#dbfddb',
					200: '#baf9b9',
					300: '#82f382',
					400: '#60e760',
					500: '#1dca1e',
					600: '#11a812',
					700: '#118412',
					800: '#136814',
					900: '#125515',
					950: '#042f06'
				},
				sunglo: {
					50: '#fdf3f3',
					100: '#fbe5e5',
					200: '#f9cfcf',
					300: '#f3aeae',
					400: '#e87272',
					500: '#dd5656',
					600: '#c93939',
					700: '#a92c2c',
					800: '#8c2828',
					900: '#752727',
					950: '#3f1010'
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
