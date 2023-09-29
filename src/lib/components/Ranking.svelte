<script lang="ts">
	import type { IFetchResponse, IProblem } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	$: handleProblem = customFetch<IFetchResponse<IProblem[]>>({
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
</script>

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
