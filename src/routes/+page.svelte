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

	let modalOpen = false;
	let title: string = '';
	let body: string = '';
	let etc: any;

	const handleModal = (data: IModal) => {
		title = data.title;
		body = data.body;
		etc = data.etc;
		modalOpen = true;
	};

	$: handleHome = customFetch<IFetchResponse<any>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ rank { id studNo team k rank tries score } problems {no} }`
		})
	})
		.then((res: IFetchResponse<any>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return {
				rank: res.data.rank.filter(
					(rank: IStudent) => rank.id === Number(get(user)?.studId)
				)[0] as IStudent,
				problems: res.data.problems as IProblem[]
			};
		})
		.catch((e: Error) => {
			alert(e);
			return { rank: null, problems: [] };
		});
</script>

<div class="flex flex-col items-center justify-center">
	<div class="relative overflow-x-auto py-6">
		<table class="w-full text-lg text-center">
			{#await handleHome then { rank, problems }}
				<Ranking {problems} />
				<UserInfo {rank} {handleModal} />
			{/await}
		</table>
	</div>
	<div class="w-full flex flex-row justify-between px-24">
		<SubmissionTable {handleModal} />
		<ClarificationTable />
	</div>
</div>

<Modal {title} bind:open={modalOpen} autoclose outsideclose>
	<div class="p-4">
		<p class="text-gray-700 text-base">
			{body}
		</p>
	</div>
</Modal>
