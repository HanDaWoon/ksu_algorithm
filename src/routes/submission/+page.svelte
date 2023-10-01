<script lang="ts">
	import type { IFetchResponse, ISubmit, IStudent } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import { getTimeDifferenceString } from '$lib/utils';

	interface ISubmitWithStudent extends ISubmit {
		studNo: string;
		team: string;
	}

	$: handleSubmissions = customFetch<IFetchResponse<any>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ submits { id stud_id type problemNo result memory runtime lang code_size submit_at state extra }
					  students { id studNo team }
		 			}`
		})
	})
		.then((res: IFetchResponse<any>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return {
				submits: res.data.submits
					.filter((submit: ISubmit) => submit.type == '1')
					.sort((a: ISubmit, b: ISubmit) => b.id - a.id) as ISubmit[],
				students: res.data.students as IStudent[]
			};
		})
		.then(({ submits, students }) => {
			return submits.map((submit: ISubmit) => {
				const student = students.find((student: IStudent) => student.id == submit.stud_id);
				return {
					...submit,
					studNo: student.studNo,
					team: student.team
				} as ISubmitWithStudent;
			}) as ISubmitWithStudent[];
		})
		.catch((e: Error) => {
			alert(e);
			return [];
		});
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
					<th class="px-6 py-4" scope="col">제출한 시간</th>
				</tr>
			</thead>
			<tbody>
				{#await handleSubmissions then submits}
					{#each submits as submit}
						<tr class="bg-white border-b">
							<th scope="row" class="px-6 py-4 whitespace-nowrap font-medium">
								{submit.id}
							</th>
							<td class="px-6 py-4 whitespace-nowrap font-medium">
								<p>{submit.studNo}</p>
								<p class="text-gray-500">{submit.team}</p>
							</td>
							<td class="px-6 py-4">
								<a href={`problem/${submit.problemNo}`}>{submit.problemNo}</a>
							</td>
							{#if submit.state == '0'}
								<td class="px-6 py-4"> <div class="text-gray-500">채점 대기</div> </td>
								<td class="px-6 py-4" />
								<td class="px-6 py-4" />
							{:else if submit.state == '1'}
								<td> <div>채점 중...</div> </td>
								<td class="px-6 py-4" />
								<td class="px-6 py-4" />
							{:else if submit.state == '2'}
								{#if submit.result == '0'}
									<td class="px-6 py-4"> <div class="text-green-400">정답</div> </td>
									<td class="px-6 py-4">
										{submit.memory}
										<div class="inline text-red-500">B</div>
									</td>
									<td class="px-6 py-4">
										{submit.runtime}
										<div class="inline text-red-500">ms</div>
									</td>
								{:else if submit.result == '1'}
									<td class="px-6 py-4">
										<div class="text-red-orange-500">{submit.extra}</div>
									</td>
									<td class="px-6 py-4" />
									<td class="px-6 py-4" />
								{/if}
							{:else}
								{submit.state}
							{/if}
							<td>
								{submit.lang}
							</td>
							<td>
								{submit.code_size}
								<div class="inline text-red-500">B</div>
							</td>
							<td>
								{getTimeDifferenceString(new Date(parseInt(submit.submit_at)))}
							</td>
						</tr>
					{/each}
				{/await}
			</tbody>
		</table>
	</div>
</div>
