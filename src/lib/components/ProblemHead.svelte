<script lang="ts">
	export let problems: IProblem[];
	import type { IProblem } from '$lib/types';
</script>

<thead class="text-base text-gray-700 uppercase bg-gray-50">
	<tr>
		<th scope="col" class=" w-24 px-6 py-3">랭킹</th>
		<th scope="col" class=" w-48 px-6 py-3">학번</th>
		<th scope="col" class=" w-36 px-6 py-3">점수</th>
		{#each problems as problem}
			<th scope="col" class="px-6 py-3 w-32">
				<a href={`problem/${problem.no}`}>{problem.no}</a>
			</th>
		{/each}
		<th />
	</tr>
</thead>
