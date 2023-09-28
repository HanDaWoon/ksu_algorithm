<script lang="ts">
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IStudent } from '$lib/types';
	import { calculateRemainingTime } from '$lib/utils';

	let remainingTime: string;
	$: handleStudStat = customFetch<IFetchResponse<IStudent>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ info { k d a } }`
		})
	})
		.then((res: IFetchResponse<IStudent>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.info;
		})
		.catch((e: Error) => {
			alert(e);
		});
	$: (() =>
		setInterval(() => {
			remainingTime = calculateRemainingTime();
		}, 1000))();
</script>

<div class="">
	<div class="flex space-x-3 text-lg font-medium">
		{#await handleStudStat then stat}
			{#if stat}
				<div class="text-green-400">성공 {stat.k}</div>
				<div class="text-red-400">실패 {stat.d}</div>
				<div class="text-yellow-400">대기 {stat.a}</div>
				<div class="text-white">순위 {stat.rank}</div>
			{/if}
		{/await}
		<div class="text-gray-300">
			남은시간 {remainingTime}
		</div>
	</div>
</div>
