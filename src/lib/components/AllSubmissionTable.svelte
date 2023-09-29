<script lang="ts">
	import type { IFetchResponse, ISubmit, IStudent } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	// import { ScoreCell } from './ScoreCell.svelte';

	let submits: ISubmit[] = [];
	let students: IStudent[] = [];

	const fetchData = async () => {
		const _submits = await customFetch<IFetchResponse<ISubmit[]>>({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{ submits { id stud_id problemNo result memory runtime lang code_size submit_at } }`
			})
		})
			.then((res: IFetchResponse<ISubmit[]>) => {
				if (res.errors) throw new Error(res.errors[0].message);
				return res.data.submits;
			})
			.catch((e: Error) => {
				alert(e);
				return [];
			});
		submits = await _submits;
		// const _students = await customFetch<IFetchResponse<IStudent[]>>({
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		query: `query { students { studNo id } }`
		// 	})
		// })
		// 	.then((res: IFetchResponse<IStudent[]>) => {
		// 		if (res.errors) throw new Error(res.errors[0].message);
		// 		return res.data.rank;
		// 	})
		// 	.catch((e: Error) => {
		// 		alert(e);
		// 		return [];
		// 	});
		// students = await _students;
	};

	$: fetchData();
</script>

<div class="text-lg px-10 py-5">
	<h3 class="text-center text-lg bg-blue-300 font-bold border-y-2 border-black mb-4">
		SubmissionStatus
	</h3>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-left">
			<thead class="text-base text-gray-700 uppercase bg-gray-50">
				<tr>
					<th class="px-6 py-4" scope="col">제출 번호</th>
					<th class="px-6 py-4" scope="col">학번</th>
					<th class="px-6 py-4" scope="col">문제</th>
					<th class="px-6 py-4" scope="col">결과</th>
					<th class="px-6 py-4" scope="col">메모리</th>
					<th class="px-6 py-4" scope="col">시간</th>
					<th class="px-6 py-4" scope="col">언어</th>
					<th class="px-6 py-4" scope="col">코드 길이</th>
					<th class="px-6 py-4" scope="col">제출 시간</th>
				</tr>
			</thead>
			<tbody class="text-xs">
				{#if submits}
					{#each submits as submit}
						<tr class="bg-white border-b">
							<th scope="row" class="px-6 py-4 whitespace-nowrap font-medium">
								{submit.id}
							</th>
							<td class="px-6 py-4 whitespace-nowrap font-medium">
								{submit.stud_id}
							</td>
							<td class="px-6 py-4">
								{submit.problemNo}
							</td>
							<td class="px-6 py-4">
								<!-- <ScoreCell submission={submit} /> -->
								{submit.result}
							</td>
							<td class="px-6 py-4"> {submit.memory} </td>
							<td class="px-6 py-4"> {submit.runtime} </td>
							<td class="px-6 py-4">
								{submit.lang}
							</td>
							<td class="px-6 py-4"> {submit.code_size} </td>
							<td class="px-6 py-4"> {submit.submit_at} </td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
