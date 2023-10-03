<script lang="ts">
	import type {
		IFetchResponse,
		IModal,
		IProblem,
		IProblemWithSubmit,
		IStudent,
		ISubmit
	} from '$lib/types';
	import ClarificationTable from '$lib/components/NoticeTable.svelte';
	import Ranking from '$lib/components/ProblemHead.svelte';
	import SubmissionTable from '$lib/components/SubmissionTable.svelte';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import { customFetch } from '$lib/customFetch';
	import { get } from 'svelte/store';
	import { user } from '$lib/user';
	import { Modal, List, Li } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { handleJudges } from '$lib/utils';

	let modalOpen = false;
	let title: string = '';
	let body: string = '';
	let etc: IProblemWithSubmit | ISubmit | undefined;

	let rank: IStudent;
	let problems: IProblem[];

	const handleModal = (data: IModal) => {
		title = data.title;
		body = data.body;
		etc = data.etc;
		modalOpen = true;
	};

	const refreshData = async () => {
		try {
			const response = await customFetch<IFetchResponse<any>>({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `{ rank { id studNo team k rank tries score } problems {no} }`
				})
			});

			if (response.errors) {
				throw new Error(response.errors[0].message);
			}

			rank = response.data.rank.filter(
				(rank: IStudent) => rank.id === Number(get(user)?.studId)
			)[0] as IStudent;
			problems = response.data.problems;
		} catch (e) {
			console.log(e);
			return e;
		}
	};

	refreshData();
	const refreshIntervalId = setInterval(refreshData, 5000);

	onDestroy(() => clearInterval(refreshIntervalId));
</script>

<div class="flex flex-col items-center justify-center">
	<div class="relative overflow-x-auto py-6">
		<table class="w-full text-lg text-center">
			{#if rank && problems}
				<Ranking {problems} />
				<UserInfo {rank} {handleModal} />
			{/if}
		</table>
	</div>
	<div class="w-full flex flex-row justify-between px-24">
		<SubmissionTable {handleModal} />
		<ClarificationTable {handleModal} />
	</div>
</div>

<Modal title={'제출번호: ' + title} bind:open={modalOpen} size={'lg'} autoclose outsideclose>
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
