<script lang="ts">
	import type { IFetchResponse, ISubmit } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	// import { ScoreCell } from './ScoreCell.svelte';

	$: handleSubmissions = customFetch<IFetchResponse<ISubmit[]>>('', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ submits { id stud_id problemNo lang result } }`
			// query: `{ submits { id stud_id type problemNo lang code state extra result memory runtime code_size submit_at} }`
		})
	})
		.then((res: IFetchResponse<ISubmit[]>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.submits;
		})
		.catch((e: Error) => {
			alert(e);
		});
</script>

<div class="text-lg px-10 py-5">
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
				{#await handleSubmissions then submits}
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
				{/await}
			</tbody>
		</table>
	</div>
</div>
