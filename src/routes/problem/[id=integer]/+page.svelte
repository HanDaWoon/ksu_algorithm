<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, IProblem } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	$: console.log(data);
</script>

{#if data}
	<article class="prose lg:prose-xl">
		<h3>{data.problem.title}</h3>
		<div contenteditable="true" bind:innerHTML={data.problem.body} />
	</article>
{/if}
