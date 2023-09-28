<script lang="ts">
	import type { IFetchResponse, ISubmit } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import { unixTimeToDate } from '$lib/utils';

	$: handleSubmissions = customFetch<IFetchResponse<ISubmit[]>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ submit { id type problemNo lang state extra result } }`
		})
	})
		.then((res: IFetchResponse<ISubmit[]>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.submit;
		})
		.catch((e: Error) => {
			alert(e);
		});
</script>

<div>
	<h3 class="text-center text-lg bg-blue-300 font-bold border-y-2 border-black mb-4">
		Submissions
	</h3>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-lg text-left">
			<thead class="text-base text-gray-700 uppercase bg-gray-50">
				<tr>
					<th scope="col" class="px-6 py-3">Time</th>
					<th scope="col" class="px-6 py-3">Problem</th>
					<th scope="col" class="px-6 py-3">Lang</th>
					<th scope="col" class="px-6 py-3">Result</th>
				</tr>
			</thead>
			<tbody>
				{#await handleSubmissions then submitList}
					{#if submitList}
						{#each submitList as submit}
							<tr class="bg-white border-b">
								<th scope="row" class="px-6 py-4 whitespace-nowrap font-medium">
									<!-- {unixTimeToDate(submit.submit_at).toLocaleTimeString()} -->
									{submit.id}
								</th>
								<td class="px-6 py-4 whitespace-nowrap font-medium">
									<a href={`problem/${submit.problemNo}`}>
										{submit.problemNo}
									</a>
								</td>
								<td class="px-6 py-4">
									{submit.lang}
								</td>
								<td
									class="px-6 py-4"
									class:text-red-600={submit.result === 'WRONG-ANSWER'}
									class:text-green-600={submit.result === 'CORRECT'}
									class:text-gray-600={submit.result === 'PENDING'}
								>
									{submit.result}
								</td>
							</tr>
						{/each}
					{/if}
				{/await}
			</tbody>
		</table>
	</div>
</div>
