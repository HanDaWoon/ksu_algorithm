<script lang="ts">
	export let submitId: number;

	import type { IProblemJudgeResult } from '$lib/types';
	import { handleJudges } from '$lib/utils';
	import { List, Li } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	let judges: IProblemJudgeResult;

	if (submitId) {
		const handleRunOut = async () => {
			judges = await handleJudges(submitId);
		};
		handleRunOut();
		const refreshIntervalId = setInterval(handleRunOut, 1000);
		onDestroy(() => clearInterval(refreshIntervalId));
	}
</script>

<div class="h-full overflow-auto bg-mystic-100">
	{#if judges}
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
	{/if}
</div>
