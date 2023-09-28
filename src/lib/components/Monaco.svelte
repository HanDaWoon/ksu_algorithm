<script lang="ts">
	export let selected_language: string;
	export let selected_theme: string;
	export let value = '';

	// if you want to get themes, feel free to import exportedThemes, nativeThemes, or themeNames.
	import Monaco from 'svelte-monaco';
</script>

<div class="h-full w-full">
	<!-- event.detail is the monaco instance. All options are reactive! -->
	<Monaco
		options={{
			fontSize: 18,
			automaticLayout: true,
			language: selected_language.toLowerCase()
		}}
		theme={selected_theme === 'dark' ? 'vs-dark' : 'vs'}
		on:ready={(event) => console.log(event.detail)}
		bind:value
	/>
</div>
