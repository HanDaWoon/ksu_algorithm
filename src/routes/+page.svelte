<script lang="ts">
	import type { IFetchResponse, IModal, IProblem, IStudent } from '$lib/types';
	import ClarificationTable from '$lib/components/NoticeTable.svelte';
	import Ranking from '$lib/components/ProblemHead.svelte';
	import SubmissionTable from '$lib/components/SubmissionTable.svelte';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import { customFetch } from '$lib/customFetch';
	import { get } from 'svelte/store';
	import { user } from '$lib/user';
	import { Modal } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	let modalOpen = false;
	let title: string = '';
	let body: string = '';
	let etc: any;

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

<Modal {title} bind:open={modalOpen} autoclose outsideclose>
	<div class="p-4">
		<p class="text-gray-700 text-base">
			{body}
		</p>
	</div>
</Modal>
