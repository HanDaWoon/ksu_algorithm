<script lang="ts">
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IProblemWithSubmit, IStudent } from '$lib/types';
	import { user } from '$lib/user';
	import { get } from 'svelte/store';
	import ScoreCell from './ScoreCell.svelte';
	import UserScore from './UserScore.svelte';

	let submits: IProblemWithSubmit[] = [];
	let students: IStudent[] = [];
	export let studId: number;

	const fetchData = async () => {
		// const _submits = await customFetch<IFetchResponse<IProblemWithSubmit[]>>('', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		query: `{ problemsWithSubmitByStudId(studId:${studId}){ no result }}`
		// 	})
		// })
		// 	.then((res: IFetchResponse<IProblemWithSubmit[]>) => {
		// 		if (res.errors) throw new Error(res.errors[0].message);
		// 		return res.data.submits;
		// 	})
		// 	.catch((e: Error) => {
		// 		alert(e);
		// 		return [];
		// 	});
		// submits = await _submits;
		const _students = await customFetch<IFetchResponse<IStudent[]>>('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{ students { id rank studNo team tries score} }`
			})
		})
			.then((res: IFetchResponse<IStudent[]>) => {
				if (res.errors) throw new Error(res.errors[0].message);
				return res.data.students;
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
			<tr class="bg-white border-b">
				<td class=" w-24 px-6 py-3">{student.rank}</td>
				<td class="w-48 px-6 py-3">{student.studNo} {student.team}</td>
				<td class="w-36 px-6 py-3">{student.tries} {student.score}</td>
				<UserScore studId={student.id} tries={student.tries} />
			</tr>
		{/each}
		<!-- {#each submits as submit}
			<tr class="bg-white border-b">
				<td class="px-6 py-3">{submit.no}</td>
			</tr>
		{/each} -->
	{/if}
</tbody>
