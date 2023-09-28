<script lang="ts">
	import type { IFetchResponse, IProblem } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import UserInfo from '$lib/components/UserInfo.svelte';

	$: handleProblem = customFetch<IFetchResponse<IProblem[]>>('', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ problems {no} }`
		})
	})
		.then((res: IFetchResponse<IProblem[]>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.problems;
		})
		.catch((e: Error) => {
			alert(e);
		});

	export function load({ params }: { params: { studId: number } }) {
		studId = params.studId;
	}
</script>

<div class="text-lg px-10">
	<div class=" text-center mt-8 text-gray-900 py-2 pb-5">
		<div class="text-3xl">2023 소프트웨어학과 알고리즘 경진대회</div>
		<div>starts : 16:30 - ends : 19:30</div>
	</div>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-lg text-center">
			{#await handleProblem then problems}
				{#if problems}
					<thead class="text-base text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" class=" w-24 px-6 py-3">랭킹</th>
							<th scope="col" class=" w-48 px-6 py-3">학번</th>
							<th scope="col" class=" w-36 px-6 py-3">점수</th>
							{#each problems as problem}
								<th scope="col" class="px-6 py-3">
									{problem.no}
								</th>
							{/each}
							<th />
						</tr>
					</thead>
				{/if}
			{/await}
			<UserInfo />
		</table>
	</div>
</div>
