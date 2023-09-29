<script lang="ts">
	import ClarificationTable from '$lib/components/NoticeTable.svelte';
	import Ranking from '$lib/components/Ranking.svelte';
	import SubmissionTable from '$lib/components/SubmissionTable.svelte';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import { user } from '$lib/user';
	import { get } from 'svelte/store';

	const studId = parseInt(get(user)?.studId || '0');
</script>

<div class="flex flex-col items-center justify-center">
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-lg text-center py-5">
			<Ranking />
			<UserInfo {studId} />
		</table>
	</div>
	<div class="w-full flex flex-row justify-between px-24">
		<SubmissionTable />
		<ClarificationTable />
	</div>
</div>
