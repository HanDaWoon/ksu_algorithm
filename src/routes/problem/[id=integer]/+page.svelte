<script lang="ts">
	import { page } from '$app/stores';
	import RunOut from '$lib/components/RunOut.svelte';
	import { Button, Select } from 'flowbite-svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Monaco from 'svelte-monaco';
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, ISubmit } from '$lib/types';

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
	let selected_language =
		$page.data.problemData.lang === ''
			? sessionStorage.getItem('lang') ?? languages[0].value
			: $page.data.problemData.lang;
	let selected_theme: string = 'light';
	let value = $page.data.problemData.code ?? '';
	let submitId: number;

	const handleSubmit = async (submitType: string) => {
		sessionStorage.setItem('lang', selected_language);
		await customFetch<IFetchResponse<ISubmit>>({
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
		}).then((res: IFetchResponse<ISubmit>) => {
			console.log(res);
			submitId = res.data.submit.id;
		});
	};
</script>

<div class="h-code">
	<header class="flex flex-row justify-between px-4 py-1 gap-4 items-center bg-slate-200 h-10">
		<div class="text-xl font-semibold min-w-fit">{$page.data.problemData.title}</div>
		<div class="flex flex-row gap-4">
			{#if selected_theme === 'light'}
				<Button size={'sm'} on:click={() => (selected_theme = 'dark')} color={'dark'}>Dark</Button>
			{:else}
				<Button size={'sm'} on:click={() => (selected_theme = 'light')} color={'alternative'}>
					Light
				</Button>
			{/if}
			<Select
				class={'text-sm w-fit h-fit'}
				items={languages}
				bind:value={selected_language}
				size={'sm'}
			/>
		</div>
	</header>
	<Splitpanes>
		<Pane minSize={20} maxSize={50}>
			<div class="bg-white">
				<article
					class="prose lg:prose-xl px-4 bg-white h-screen overflow-y-scroll pb-8"
					contenteditable="false"
					bind:innerHTML={$page.data.problemData.body}
				/>
			</div>
		</Pane>
		<Pane>
			<Splitpanes horizontal={true} pushOtherPanes={false}>
				<Pane size={60} minSize={40} maxSize={75}>
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
				<Pane>
					<RunOut {submitId} />
					<div class="fixed bottom-1 right-1">
						<Button
							class="font-bold"
							color="alternative"
							size={'md'}
							on:click={() => handleSubmit('0')}>실행</Button
						>
						<Button
							class="font-bold"
							color="green"
							size={'md'}
							on:click={() => handleSubmit('1')}
							disabled={$page.data.problemData.result === '0' &&
								$page.data.problemData.type === '1'}
						>
							제출
						</Button>
					</div>
				</Pane>
			</Splitpanes>
		</Pane>
	</Splitpanes>
</div>
