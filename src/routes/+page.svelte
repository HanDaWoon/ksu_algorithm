<script lang="ts">
	import ClarificationTable from '$lib/components/NoticeTable.svelte';
	import SubmissionTable from '$lib/components/SubmissionTable.svelte';
	import UserScore from '$lib/components/UserScore.svelte';
</script>

<div class="flex flex-col items-center justify-center">
	<UserScore />
	<div class="w-full flex flex-row justify-between px-24">
		<SubmissionTable />
		<ClarificationTable />
	</div>
</div>
