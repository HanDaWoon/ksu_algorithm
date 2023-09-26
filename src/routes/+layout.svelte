<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import SignInForm from '$lib/components/SignInForm.svelte';
	import { user } from '$lib/user';
	import '../app.css';
	let isSignedIn = false;
	$: user.subscribe((value) => {
		if (value) {
			isSignedIn = true;
		} else {
			isSignedIn = false;
		}
	});
</script>

<main>
	{#if !isSignedIn}
		<SignInForm />
	{:else}
		<Navigation />
		<slot />
	{/if}
</main>
