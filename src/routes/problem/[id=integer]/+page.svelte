<script lang="ts">
	import { page } from '$app/stores';
	import RunOut from '$lib/components/RunOut.svelte';
	import { Button, Select } from 'flowbite-svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Monaco from 'svelte-monaco';
	import { customFetch } from '$lib/customFetch';

	let languages = [
		{ value: 'c', name: 'C(99)' },
		{ value: 'cpp', name: 'C++(20)' },
		{ value: 'python', name: 'Python3' },
		{ value: 'java', name: 'Java 17' },
		{ value: 'kotlin', name: 'Kotlin' },
		{ value: 'rust', name: 'Rust' },
		{ value: 'go', name: 'Go' },
		{ value: 'javascript', name: 'JavaScript' }
	];
	const lang = sessionStorage.getItem('lang') ?? $page.data.problemData.lang;
	let selected_language = lang ?? languages[0].value;
	let selected_theme: string = 'light';
	let value = $page.data.problemData.code ?? '';
	let submitId: number;

	const handleSubmit = async (submitType: string) => {
		sessionStorage.setItem('lang', selected_language);
		await customFetch({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `
					mutation { insertSubmit(
							stud_id: ${$page.data.signInUser.studId}
							type: ${submitType}
							problemNo: ${$page.data.problemData.no}
							lang: ${selected_language}
							code: ${value}
						) {
							id
						}
					}
				`
			})
		}).then((res) => {
			console.log(res);
			// submitId = res.data.updateSubmit.id;
		});
	};
</script>

<main class="h-screen">
	<header class="flex flex-row justify-between px-4 py-1 gap-4 items-center bg-slate-200">
		<div class="text-xl font-semibold min-w-fit">{$page.data.problemData.title}</div>
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
	<Splitpanes style="background-color: white;">
		<Pane minSize={20} maxSize={50}>
			<article
				class="prose lg:prose-xl p-2 h-full bg-white overflow-auto"
				contenteditable="false"
				bind:innerHTML={$page.data.problemData.body}
			/>
		</Pane>
		<Pane>
			<Splitpanes horizontal={true} style="background-color: white;">
				<Pane size={65} minSize={40}>
					<Monaco
						options={{
							fontSize: 18,
							automaticLayout: true,
							language: selected_language.toLowerCase()
						}}
						theme={selected_theme === 'dark' ? 'vs-dark' : 'vs'}
						bind:value
					/>
				</Pane>
				<Pane minSize={20}>
					<RunOut {submitId} />
					<Button
						color="alternative"
						class="absolute bottom-1 right-20"
						on:click={() => handleSubmit('0')}>실행</Button
					>
					<Button
						class="absolute bottom-1 right-2 bg-dodger-blue-600"
						on:click={() => handleSubmit('1')}>제출</Button
					>
				</Pane>
			</Splitpanes>
		</Pane>
	</Splitpanes>
</main>
