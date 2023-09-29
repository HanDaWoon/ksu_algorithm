<script lang="ts">
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IProblemWithSubmit, IStudent } from '$lib/types';
	import ScoreCell from './ScoreCell.svelte';
	import UserScore from './UserScore.svelte';
	let students: IStudent[] = [];
	export let studId: number | null = null;

	const fetchData = async () => {
		const _students = await customFetch<IFetchResponse<IStudent[]>>({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `
			query {
				rank{ studNo rank team k score id tries}
			}
		`
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

<tbody class="relative overflow-x-auto py-6">
	{#if students}
		{#each students as student}
			<!-- {#each students as student} -->
			{#if studId === null || (studId === student.id && student.studNo === student.studNo)}
				<tr class="bg-white border-b">
					<td class=" w-24 px-6 py-3">{student.rank}</td>
					<td class="w-48 px-6 py-3">{student.studNo} {student.team}</td>
					<td class="w-36 px-6 py-3"><b>{student.k}</b> {student.score}</td>
					<UserScore studId={student.id} tries={student.tries} />
				</tr>
			{/if}
		{/each}
		<!-- {/each} -->
	{/if}
</tbody>
