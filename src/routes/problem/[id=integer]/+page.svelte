<script lang="ts">
	import { page } from '$app/stores';
	import { Button, Li, List, Select } from 'flowbite-svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Monaco from 'svelte-monaco';
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IProblemJudgeResult, ISubmit } from '$lib/types';
	import { escapeSpecialChars, handleJudges } from '$lib/utils';
	import { onDestroy } from 'svelte';
	import Problem from '$lib/components/Problem.svelte';

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
	let judges: IProblemJudgeResult;

	let refreshIntervalId: NodeJS.Timeout;

	const handleSubmit = async (submitType: string) => {
		sessionStorage.setItem('lang', selected_language);
		await customFetch<IFetchResponse<ISubmit>>({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `mutation {
					insertSubmit(
						stud_id: ${$page.data.signInUser.studId},
						type: "${submitType}",
						problemNo: ${$page.data.problemData.no},
						lang: "${selected_language}",
						code: "${escapeSpecialChars(value)}"
					) { id stud_id problemNo } 
				}`
			})
		})
			.then((res: IFetchResponse<ISubmit>) => {
				if (res.errors) throw new Error(res.errors[0].message);
				submitId = res.data.insertSubmit.id;
				refreshIntervalId = setInterval(handleRunOut, 1000);
			})
			.catch((err: Error) => {
				console.error(err);
			});
	};

	const handleRunOut = async () => {
		judges = await handleJudges(submitId);
		// null이 없으면 중단
		if (judges.judge.every((j) => j.judge_detail !== null)) {
			clearInterval(refreshIntervalId);
			return;
		}
	};

	onDestroy(() => clearInterval(refreshIntervalId));
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
			<div class="bg-white w-full h-full">
				<Problem problemHtml={$page.data.problemData.body} />
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
					<div class="h-full overflow-auto bg-mystic-100">
						{#if judges}
							<List tag="ul">
								{#each judges.judge as j, idx}
									<Li>
										테스트 케이스 {idx}
										<div class="inline text-gray-400">{j.testcase_id}</div>
										{#if j.judge_detail}
											<List tag="ul" cla}ss="pl-5 space-y-1">
												{#each j.judge_detail as jd, idx2}
													<Li>
														Judge {idx2}
														<div class="inline text-gray-400">{jd.id}</div>
														<List tag="ul" class="pl-5 space-y-1">
															<Li>
																실행시간: {jd.runtime} ms
															</Li>
															<Li>
																결과:
																<div
																	class="inline-block"
																	class:text-green-600={jd.result === 0}
																	class:text-red-500={jd.result === 1}
																>
																	{jd.result === 0 ? '성공' : '실패'}
																</div>
															</Li>
															<Li>
																출력: <div class="whitespace-pre pl-5 space-y-1">
																	{jd.output || '없음'}
																</div>
															</Li>
														</List>
													</Li>
												{/each}
											</List>
										{:else}
											<div class="text-gray-400 pl-5 space-y-1">실행중...</div>
										{/if}
									</Li>
								{/each}
							</List>
						{/if}
					</div>
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
