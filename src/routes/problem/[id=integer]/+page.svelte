<script lang="ts">
	import { page } from '$app/stores';
	import RunOut from '$lib/components/RunOut.svelte';
	import { Button, Select } from 'flowbite-svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Monaco from 'svelte-monaco';

	let languages = [
		{ value: 'c', name: 'C(99)' },
		{ value: 'cpp', name: 'C++(20)' },
		{ value: 'python', name: 'Python3' },
		{ value: 'java', name: 'Java 17' },
		{ value: 'kotlin', name: 'Kotlin' },
		{ value: 'rust', name: 'Rust' },
		{ value: 'go', name: 'Go' },
		{ value: 'javaScript', name: 'JavaScript' }
	];
	let selected_language = languages[0].value;
	let selected_theme: string = 'light';
	let value = '';
</script>

<main class="h-screen">
	<header class="flex flex-row justify-between px-4 py-1 gap-4 items-center">
		<div class="text-xl font-semibold min-w-fit">{$page.data.problem.title}</div>
		<div class="flex flex-row gap-4">
			{#if selected_theme === 'light'}
				<Button on:click={() => (selected_theme = 'dark')} color={'dark'}>Dark</Button>
			{:else}
				<Button on:click={() => (selected_theme = 'light')} color={'alternative'}>Light</Button>
			{/if}
			<Select
				class={'text-lg w-fit h-fit'}
				items={languages}
				bind:value={selected_language}
				size={'sm'}
			/>
		</div>
	</header>
	<Splitpanes class="bg-white">
		<Pane minSize={20} maxSize={50}>
			<article
				class="prose lg:prose-xl p-2 h-full"
				contenteditable="false"
				bind:innerHTML={$page.data.problem.body}
			/>
		</Pane>
		<Pane>
			<Splitpanes horizontal={true}>
				<Pane size={60} minSize={30}>
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
				</Pane>
				<Pane minSize={20}>
					<RunOut run_id={1} />
					출력값
				</Pane>
			</Splitpanes>
		</Pane>
	</Splitpanes>
</main>
