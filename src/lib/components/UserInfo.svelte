<script lang="ts">
	export let rank: IStudent;
	export let handleModal: (data: IModal) => void | undefined = undefined;

	import type { IFetchResponse, IProblemWithSubmit, IStudent, IModal } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import ScoreCell from './ScoreCell.svelte';

	$: handleUserInfo = customFetch<IFetchResponse<IProblemWithSubmit[]>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ problemsWithSubmitByStudId(studId: ${rank.id}) { no result title score state type extra} }`
		})
	})
		.then((res: IFetchResponse<IProblemWithSubmit[]>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.problemsWithSubmitByStudId.filter(
				(ps: IProblemWithSubmit) => ps.type === '1'
			);
		})
		.catch((e: Error) => {
			alert(e);
			return [];
		});
</script>

<tr class="border-b">
	<td>{rank.rank}</td>
	<td class="">
		<p>{rank.studNo}</p>
		<p class="text-gray-500">{rank.team}</p>
	</td>
	<td class=""><b>{rank.k}</b> {rank.score}</td>
	{#await handleUserInfo then problemWithSubmit}
		<ScoreCell tries={rank.tries} {problemWithSubmit} {handleModal} />
	{/await}
</tr>
