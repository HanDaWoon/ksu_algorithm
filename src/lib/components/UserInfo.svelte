<script lang="ts">
	import type { IStudent, IFetchResponse, IProblemWithSubmit, IModal } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import ScoreCell from './ScoreCell.svelte';
	import { onMount, onDestroy } from 'svelte';

	export let rank: IStudent;
	export let handleModal: (data: IModal) => void | undefined = undefined;

	let problemWithSubmit: IProblemWithSubmit[] = [];

	const refreshUserInfo = async () => {
		try {
			const response = await customFetch<IFetchResponse<IProblemWithSubmit[]>>({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `{ problemsWithSubmitByStudId(studId: ${rank.id}) { no result title score state type extra} }`
				})
			});

			if (response.errors) {
				throw new Error(response.errors[0].message);
			}

			problemWithSubmit = response.data.problemsWithSubmitByStudId.filter(
				(ps: IProblemWithSubmit) => ps.type === '1'
			);
		} catch (e) {
			console.log(e);
			return e;
		}
	};

	onMount(refreshUserInfo);

	const refreshIntervalId = setInterval(refreshUserInfo, 5000);

	onDestroy(() => clearInterval(refreshIntervalId));
</script>

<tr class="border-b">
	<td>{rank.rank}</td>
	<td class="">
		<p>{rank.studNo}</p>
		<p class="text-gray-500">{rank.team}</p>
	</td>
	<td class=""><b>{rank.k}</b> {rank.score}</td>
	{#if problemWithSubmit}
		{#if problemWithSubmit.length > 0}
			<ScoreCell tries={rank.tries} {problemWithSubmit} {handleModal} />
		{/if}
	{/if}
</tr>
