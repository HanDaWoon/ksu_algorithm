<script lang="ts">
	import type { IFetchResponse, ISubmit, IStudent, IModal, IProblemWithSubmit } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import { getTimeDifferenceString, handleJudges } from '$lib/utils';
	import { onDestroy } from 'svelte';
	import { Li, List, Modal } from 'flowbite-svelte';

	interface ISubmitWithStudent extends ISubmit {
		studNo: string;
		team: string;
	}

	let submitWithStudents: ISubmitWithStudent[] = [];
	let modalOpen = false;
	let title: string = '';
	let body: string = '';
	let etc: IProblemWithSubmit | ISubmit | undefined;

	const handleModal = (data: IModal) => {
		title = data.title;
		body = data.body;
		etc = data.etc;
		modalOpen = true;
	};

	const refreshSubmissions = async () => {
		try {
			const response = await customFetch<IFetchResponse<any>>({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `
		  {
			submits {
			  id stud_id type problemNo result memory runtime lang code_size submit_at state extra
			}
			students {
			  id studNo team
			}
		  }
		`
				})
			});

			if (response.errors) {
				throw new Error(response.errors[0].message);
			}

			const { submits, students } = response.data;

			submitWithStudents = submits
				.filter((submit: ISubmit) => submit.type == '1')
				.sort((a: ISubmit, b: ISubmit) => b.id - a.id)
				.map((submit: ISubmit) => {
					const student = students.find((student: IStudent) => student.id == submit.stud_id);
					return {
						...submit,
						studNo: student.studNo,
						team: student.team
					} as ISubmitWithStudent;
				});
		} catch (e) {
			console.log(e);
			alert(e);
		}
	};

	refreshSubmissions();
	const intervalId = setInterval(refreshSubmissions, 5000);
	onDestroy(() => clearInterval(intervalId));
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
				{#if submitWithStudents}
					{#each submitWithStudents as submit}
						<tr class="bg-white border-b">
							<th scope="row" class="px-6 py-2 whitespace-nowrap font-medium">
								{submit.id}
							</th>
							<td class="px-6 py-2 whitespace-nowrap font-medium">
								<p>{submit.studNo}</p>
								<p class="text-gray-500">{submit.team}</p>
							</td>
							<td class="px-6 py-2">
								<a href={`problem/${submit.problemNo}`}>{submit.problemNo}</a>
							</td>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							{#if submit.state == '0'}
								<td class="px-6 py-2"> <div class="text-gray-500">채점 대기</div> </td>
								<td class="px-6 py-2" />
								<td class="px-6 py-2" />
							{:else if submit.state == '1'}
								<td> <div>채점 중...</div> </td>
								<td class="px-6 py-2" />
								<td class="px-6 py-2" />
							{:else if submit.state == '2'}
								{#if submit.result == '0'}
									<td class="px-6 py-2"> <div class="text-green-400">정답</div> </td>
									<td class="px-6 py-2">
										{submit.memory}
										<div class="inline text-red-500">B</div>
									</td>
									<td class="px-6 py-2">
										{submit.runtime}
										<div class="inline text-red-500">ms</div>
									</td>
								{:else if submit.result == '1'}
									<td class="px-6 py-2">
										<div class="text-red-orange-500">{submit.extra}</div>
									</td>
									<td class="px-6 py-2" />
									<td class="px-6 py-2" />
								{/if}
							{:else}
								{submit.state}
							{/if}
							<td class="px-6 py-2">
								{submit.lang}
							</td>
							<td class="px-6 py-2">
								{submit.code_size}
								<div class="inline text-red-500">B</div>
							</td>
							<td
								class="px-6 py-2"
								on:click={() =>
									handleModal({
										title: submit.id.toString(),
										body: submit.extra,
										etc: submit
									})}
							>
								{getTimeDifferenceString(new Date(parseInt(submit.submit_at)))}
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal title={'제출번호: ' + title} bind:open={modalOpen} size={'xl'} autoclose outsideclose>
	<div class="text-xl text-black">
		{#if etc}
			{#await handleJudges(etc.id) then judges}
				<p>문제 : {judges.result.no}번 {judges.result.title}</p>
				<p>제출 언어 : {judges.result.lang}</p>
				<p>실행시간 / 메모리 : {judges.result.runtime} ms / {judges.result.memory} B</p>
				<List tag="ul">
					{#each judges.judge as j}
						<Li>
							테스트 케이스 {j.testcase_id}
							{#if j.judge_detail}
								<List tag="ul" class="pl-5 space-y-1">
									{#each j.judge_detail as jd}
										<Li>
											Judge {jd.id}
											<List tag="ul" class="pl-5 space-y-1">
												<Li>
													실행시간: {jd.runtime} ms
												</Li>
												<Li>
													결과:
													<div
														class="inline-block"
														class:text-green-600={jd.result === 0}
														class:text-red-500={jd.result === 1}
													>
														{jd.result === 0 ? '성공' : '실패'}
													</div>
												</Li>
												<Li>
													출력: <div class="whitespace-pre pl-5 space-y-1">
														{jd.output || '없음'}
													</div>
												</Li>
											</List>
										</Li>
									{/each}
								</List>
							{/if}
						</Li>
					{/each}
				</List>
			{/await}
		{/if}
	</div>
</Modal>
