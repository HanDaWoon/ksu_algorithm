<script lang="ts">
	import type { IFetchResponse, IProblem } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import Ranking from '$lib/components/Ranking.svelte';
</script>

<div class="text-lg px-10">
	<div class=" text-center mt-8 text-gray-900 py-2 pb-5">
		<div class="text-3xl">2023 소프트웨어학과 알고리즘 경진대회</div>
		<div>starts : 16:30 - ends : 19:30</div>
	</div>
	<h3 class="text-center text-lg bg-blue-300 font-bold border-y-2 border-black mb-4">ScoreBoard</h3>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-lg text-center">
			<Ranking />
			<UserInfo />
		</table>
	</div>
</div>
