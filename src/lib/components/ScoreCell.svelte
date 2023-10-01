<script lang="ts">
	export let tries: ITry | undefined, problemWithSubmit: IProblemWithSubmit[];
	export let handleModal: (data: IModal) => void | undefined = undefined;

	import type { IModal, IProblemWithSubmit, ITry } from '$lib/types';
</script>

{#each problemWithSubmit as ps}
	<td
		on:click={() => {
			handleModal &&
				handleModal({
					title: ps.no.toString(),
					body: ps.extra,
					etc: ps
				});
		}}
	>
		{#if tries}
			{#if tries[ps.no]}
				<div
					class="h-full w-full text-black"
					class:bg-cornflower-blue-500={ps.state === '0' || ps.state === '1'}
					class:bg-red-orange-500={ps.result === '1'}
					class:bg-green-400={ps.result === '0'}
				>
					<div class="text-base font-medium">
						{tries[ps.no].score}
					</div>
					<div>
						{tries[ps.no].try_cnt}
						{#if ps.state === '0' || ps.state === '1'}
							+ 1
							{tries[ps.no].try_cnt === 0 ? 'try' : 'tries'}
						{:else}
							{tries[ps.no].try_cnt === 1 ? 'try' : 'tries'}
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</td>
{/each}
