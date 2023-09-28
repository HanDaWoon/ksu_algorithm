<script lang="ts">
	import ClarificationTable from '$lib/components/NoticeTable.svelte';
	import SubmissionTable from '$lib/components/SubmissionTable.svelte';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import { user } from '$lib/user';
	import { get } from 'svelte/store';
</script>

<div class="flex flex-col items-center justify-center">
	<UserInfo studId={parseInt(get(user)?.studId ?? '')} />
	<div class="w-full flex flex-row justify-between px-24">
		<SubmissionTable />
		<ClarificationTable />
	</div>
</div>
