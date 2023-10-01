<script lang="ts">
	import type { IStudent, IFetchResponse, IProblem } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import Ranking from '$lib/components/ProblemHead.svelte';

	$: handleScoreBoard = customFetch<IFetchResponse<any>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ rank { id studNo team k rank tries score } problems {no} }`
		})
	})
		.then((res: IFetchResponse<any>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return { rank: res.data.rank as IStudent[], problems: res.data.problems as IProblem[] };
		})
		.catch((e: Error) => {
			alert(e);
			return { rank: [], problems: [] };
		});
</script>

<div class="text-lg px-10">
	<div class=" text-center mt-8 text-gray-900 py-2 pb-5">
		<div class="text-3xl">2023 소프트웨어학과 알고리즘 경진대회</div>
		<div>starts : 16:30 - ends : 19:30</div>
	</div>
	<h3 class="text-center text-lg bg-blue-300 font-bold border-y-2 border-black mb-4">ScoreBoard</h3>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-lg text-center">
			{#await handleScoreBoard then { rank, problems }}
				<Ranking {problems} />
				<tbody class="relative overflow-x-auto py-6">
					{#each rank as rank}
						<UserInfo {rank} />
					{/each}
				</tbody>
			{/await}
		</table>
	</div>
</div>
