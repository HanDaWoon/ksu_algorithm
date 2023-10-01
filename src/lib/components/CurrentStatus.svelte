<script lang="ts">
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IStudent } from '$lib/types';
	import { calculateRemainingTime } from '$lib/utils';
	import { get } from 'svelte/store';
	import { user } from '$lib/user';
	import { onDestroy } from 'svelte';

	let remainingTime: string;
	let userId: number;
	let stat: IStudent;

	const updateRemainingTimeInterval = setInterval(() => {
		remainingTime = calculateRemainingTime();
	}, 1000);

	const refreshStudentStat = async () => {
		userId = parseInt(get(user).studId);

		try {
			const response = await customFetch<IFetchResponse<IStudent[]>>({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `{ rank { id rank studNo k d a } }`
				})
			});

			if (response.errors) {
				throw new Error(response.errors[0].message);
			}

			stat = response.data.rank.find((rank: IStudent) => rank.id === userId);
		} catch (e) {
			console.log(e);
			alert(e);
		}
	};

	refreshStudentStat();
	const refreshIntervalId = setInterval(refreshStudentStat, 5000);

	onDestroy(() => {
		clearInterval(refreshIntervalId);
		clearInterval(updateRemainingTimeInterval);
	});
</script>

<div class="">
	<div class="flex space-x-3 text-lg font-medium">
		{#if stat}
			<div class="text-green-400">성공 {stat.k}</div>
			<div class="text-red-400">실패 {stat.d}</div>
			<div class="text-yellow-400">대기 {stat.a}</div>
			<div class="text-white">순위 {stat.rank}</div>
		{/if}
		<div class="text-gray-300">
			남은시간 {remainingTime}
		</div>
	</div>
</div>
