<script lang="ts">
	import type {
		IStudent,
		IFetchResponse,
		IProblem,
		ISubmit,
		IModal,
		IProblemWithSubmit,
		IConfig
	} from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import Ranking from '$lib/components/ProblemHead.svelte';
	import { onDestroy } from 'svelte';
	import { Li, List, Modal } from 'flowbite-svelte';
	import { convertTimestampToKoreanTime, handleJudges } from '$lib/utils';

	let rank: IStudent[] = [];
	let problems: IProblem[] = [];
	let submits: ISubmit[] = [];
	let config: IConfig;
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

	const refreshScoreBoard = async () => {
		try {
			const response = await customFetch<IFetchResponse<any>>({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `{ rank { id studNo team k rank tries score } problems { no } submits { type state } config { START_AT END_AT } }`
				})
			});

			if (response.errors) {
				throw new Error(response.errors[0].message);
			}

			rank = response.data.rank as IStudent[];
			problems = response.data.problems as IProblem[];
			submits = response.data.submits as ISubmit[];
			config = response.data.config as IConfig;
		} catch (e) {
			alert(e);
		}
	};

	refreshScoreBoard();
	const refreshIntervalId = setInterval(refreshScoreBoard, 5000);

	onDestroy(() => clearInterval(refreshIntervalId));
</script>

<div class="text-lg px-10 flex flex-col items-center justify-center">
	<div class=" text-center mt-4 text-gray-900 py-2 pb-5">
		<div class="text-3xl">2023 소프트웨어학과 알고리즘 경진대회</div>
		<div>
			{#if config}
				starts : {convertTimestampToKoreanTime(config.START_AT)}
				- ends : {convertTimestampToKoreanTime(config.END_AT)}
			{/if}
		</div>
	</div>
	<h3 class="text-center text-lg bg-blue-300 font-bold border-y-2 border-black w-4/5">
		ScoreBoard
	</h3>
	{#if { rank, problems, submits }}
		<div class="text-center my-2">
			대기 제출 / 대기 실행 (총 제출 / 실행) :
			{submits.filter((submit) => submit.type === '1' && submit.state === '0').length}
			/
			{submits.filter((submit) => submit.type === '0' && submit.state === '0').length}
			(
			{submits.filter((submit) => submit.type === '1').length}
			/
			{submits.filter((submit) => submit.type === '0').length}
			)
		</div>
		<table class="w-fit text-lg text-center relative overflow-x-auto shadow-md sm:rounded-lg">
			<Ranking {problems} />
			<tbody class="relative overflow-x-auto py-4">
				{#each rank as rank}
					<UserInfo {rank} {handleModal} />
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<Modal title={'제출번호: ' + title} bind:open={modalOpen} size={'xl'} autoclose outsideclose>
	<div class="text-xl text-black">
		{#if etc}
			{#await handleJudges(etc.id) then judges}
				<p>문제 : {judges.result.no}번 {judges.result.title}</p>
				<p>제출 언어 : {judges.result.lang}</p>
				<p>실행시간 : {judges.result.runtime ?? '...'} ms</p>
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
