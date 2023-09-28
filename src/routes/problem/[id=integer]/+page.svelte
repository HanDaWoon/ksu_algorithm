<script lang="ts">
	import { page } from '$app/stores';
	import Monaco from '$lib/components/Monaco.svelte';
	import RunOut from '$lib/components/RunOut.svelte';
	import { ButtonGroup, Button } from 'flowbite-svelte';

	let languages = [
		'C',
		'C++',
		'Java',
		'Python',
		'Kotlin',
		'Rust',
		'Go',
		'JavaScript',
		'Typescript'
	];
	let selected_language: string = 'C';
	let selected_theme: string = 'light';
	let value = '';
</script>

<div class="flex flex-row">
	<article class="prose lg:prose-xl">
		<h3>{$page.data.problem.title}</h3>
		<div contenteditable="false" bind:innerHTML={$page.data.problem.body} />
	</article>
	<section class="w-full h-screen">
		<header>
			<ButtonGroup divClass="inline px-2">
				<Button on:click={() => (selected_theme = 'dark')}>Dark</Button>
				<Button on:click={() => (selected_theme = 'light')}>Light</Button>
			</ButtonGroup>

			<select name="language" bind:value={selected_language}>
				{#each languages as language}
					<option>{language}</option>
				{/each}
			</select>
		</header>
		<Monaco {selected_language} {selected_theme} bind:value />
	</section>
</div>
