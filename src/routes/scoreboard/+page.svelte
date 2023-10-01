<script lang="ts">
	import type { IStudent, IFetchResponse, IProblem, ISubmit } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import Ranking from '$lib/components/ProblemHead.svelte';
	import { onDestroy } from 'svelte';

	let rank: IStudent[] = [];
	let problems: IProblem[] = [];
	let submits: ISubmit[] = [];

	const refreshScoreBoard = async () => {
		try {
			const response = await customFetch<IFetchResponse<any>>({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `{ rank { id studNo team k rank tries score } problems { no } submits { type state } }`
				})
			});

			if (response.errors) {
				throw new Error(response.errors[0].message);
			}

			rank = response.data.rank as IStudent[];
			problems = response.data.problems as IProblem[];
			submits = response.data.submits as ISubmit[];
		} catch (e) {
			alert(e);
		}
	};

	refreshScoreBoard();
	const refreshIntervalId = setInterval(refreshScoreBoard, 5000);

	onDestroy(() => clearInterval(refreshIntervalId));
</script>

<div class="text-lg px-10 flex flex-col items-center justify-center">
	<div class=" text-center mt-4 text-gray-900 py-2 pb-5">
		<div class="text-3xl">2023 소프트웨어학과 알고리즘 경진대회</div>
		<div>starts : 16:30 - ends : 19:30</div>
	</div>
	<h3 class="text-center text-lg bg-blue-300 font-bold border-y-2 border-black w-4/5">
		ScoreBoard
	</h3>
	{#if { rank, problems, submits }}
		<div class="text-center my-2">
			대기 제출 / 대기 실행 (총 제출 / 실행) :
			{submits.filter((submit) => submit.type === '1' && submit.state === '0').length}
			/
			{submits.filter((submit) => submit.type === '0' && submit.state === '0').length}
			(
			{submits.filter((submit) => submit.type === '1').length}
			/
			{submits.filter((submit) => submit.type === '0').length}
			)
		</div>
		<table class="w-fit text-lg text-center relative overflow-x-auto shadow-md sm:rounded-lg">
			<Ranking {problems} />
			<tbody class="relative overflow-x-auto py-4">
				{#each rank as rank}
					<UserInfo {rank} />
				{/each}
			</tbody>
		</table>
	{/if}
</div>
