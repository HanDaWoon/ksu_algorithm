<script lang="ts">
	export let studId: number;
	export let tries: ITry;

	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IProblemWithSubmit, IStudent, ITry } from '$lib/types';
	import ScoreCell from './ScoreCell.svelte';

	let isLoading = true;
	let hasError = false;
	const query = `
        query {
            problemsWithSubmitByStudId(studId:${studId}){ no result }
        }
    `;

	$: submits = customFetch<IFetchResponse<any>>('', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query })
	})
		.then((res: IFetchResponse<any>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.problemsWithSubmitByStudId;
		})
		.catch((e: Error) => {
			alert(e);
			return [];
		});
</script>

{#await submits then submit}
	{#if submit}
		{#each submit as submit1}
			<td class="px-6 py-3">
				{submit1.result}
				<!-- <ScoreCell
					props={{
						result: submit1.result,
						score: submit1.no,
						tries: tries[submit1.no]
					}}
				/> -->
			</td>
		{/each}
	{/if}
{/await}
