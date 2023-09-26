<script lang="ts">
	import type { IProblem, IFetchResponse, ISubmit } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import { unixTimeToDate } from '$lib/utils';

	let problemSet: IProblem[] = [];

	const handleProblemSet = async () =>
		customFetch<IFetchResponse<IProblem[]>>('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{ problems { no title } }`
			})
		})
			.then((res: IFetchResponse<IProblem[]>) => {
				if (res.errors) throw new Error(res.errors[0].message);
				return res.data.problems;
			})
			.then((problems) => (problemSet = problems))
			.catch((e: Error) => {
				alert(e);
			});

	$: handleSubmissions = customFetch<IFetchResponse<ISubmit[]>>('', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ submitsByStud { id type problemNo lang state extra result code_size submit_at runtime memory } }`
		})
	})
		.then((res: IFetchResponse<ISubmit[]>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.submitsByStud;
		})
		.catch((e: Error) => {
			alert(e);
		});
	$: handleProblemSet();
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
				{#await handleSubmissions then submits}
					{#if submits}
						{#each submits as submit}
							<tr class="bg-white border-b">
								<th scope="row" class="px-6 py-4 whitespace-nowrap font-medium">
									{unixTimeToDate(submit.submit_at).toLocaleTimeString()}
								</th>
								<td class="px-6 py-4 whitespace-nowrap font-medium">
									<a href={`problem/${submit.problemNo}`}>
										{problemSet?.find((problem) => problem.no === submit.problemNo)?.title}
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
