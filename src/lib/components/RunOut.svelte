<script lang="ts">
	export let submitId: number;

	import { customFetch } from '$lib/customFetch';
	import { onDestroy } from 'svelte';

	let outLine: [string];

	// const handleRunOut = () => {
	// 	customFetch({
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			query: ``
	// 		})
	// 	}).then((res) => {
	//
	// 	});
	// };

	// handleRunOut();
	// const refreshIntervalId = setInterval(handleRunOut, 1000);

	// onDestroy(() => clearInterval(refreshIntervalId));
</script>

<div class="p-2" />
