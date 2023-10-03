<script lang="ts">
	import { customFetch } from '$lib/customFetch';
	import { onDestroy } from 'svelte';

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
	// 		console.log(res);
	// 	});
	// };

	// handleRunOut();
	// const refreshIntervalId = setInterval(handleRunOut, 1000);

	// onDestroy(() => clearInterval(refreshIntervalId));
</script>
