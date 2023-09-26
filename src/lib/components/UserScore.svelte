<!-- <script lang="ts">
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IUserTable } from '$lib/types';
	import ScoreCell from './ScoreCell.svelte';
	$: handleUserTable = customFetch<IFetchResponse<IUserTable>>('/api/v1/userTable', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res: IFetchResponse<IUserTable>) => {
			if (res.msg === 'ok') {
				return res.data;
			}
		})
		.catch((e: Error) => {
			alert(e);
		});
</script>

<div class="relative overflow-x-auto py-6">
	{#await handleUserTable then userTable}
		{#if userTable}
			<table class="w-full text-center">
				<thead class="text-xs uppercase bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-3">Rank</th>
						<th scope="col" class="px-6 py-3">User</th>
						<th scope="col" class="px-6 py-3">Score</th>
						{#each userTable.submissions as submission}
							<th scope="col" class="px-6 py-3">
								{submission.problem}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					<tr class="bg-white border-b">
						<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
							{userTable.rank}
						</th>
						<td class="px-6 py-4">{userTable.user.name}</td>
						<td class="px-6 py-4">{userTable.score}</td>
						{#each userTable.submissions as submission}
							<td>
								<ScoreCell {submission} />
							</td>
						{/each}
					</tr>
				</tbody>
			</table>
		{/if}
	{/await}
</div> -->
