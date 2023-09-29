<script lang="ts">
	export let studId: number;
	export let tries: ITry;

	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IProblemWithSubmit, IStudent, ITry } from '$lib/types';
	import ScoreCell from './ScoreCell.svelte';

	let submits: IProblemWithSubmit[] = [];
	let students: IStudent[] = [];

	const fetchData = async () => {
		const _submits = await customFetch<IFetchResponse<IProblemWithSubmit[]>>({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: ` query { problemsWithSubmitByStudId(studId:${studId}){ no result }}`
			})
		})
			.then((res: IFetchResponse<IProblemWithSubmit[]>) => {
				if (res.errors) throw new Error(res.errors[0].message);
				return res.data.problemsWithSubmitByStudId;
			})
			.catch((e: Error) => {
				alert(e);
				return [];
			});
		submits = await _submits;

		const _students = await customFetch<IFetchResponse<IStudent[]>>({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `query {rank {studNo tries }}`
			})
		})
			.then((res: IFetchResponse<IStudent[]>) => {
				if (res.errors) throw new Error(res.errors[0].message);
				return res.data.rank;
			})
			.catch((e: Error) => {
				alert(e);
				return [];
			});
		students = await _students;
	};

	$: fetchData();
</script>

{#await submits then submit}
	{#if submit && students}
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
