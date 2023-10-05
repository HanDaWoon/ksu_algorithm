<script lang="ts">
	export let problemHtml: string;
</script>

<iframe
	title="problem"
	srcdoc={problemHtml}
	frameborder="0"
	class="h-full w-full overflow-auto pb-8"
/>
