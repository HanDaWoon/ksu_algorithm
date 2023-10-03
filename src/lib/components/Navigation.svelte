<script lang="ts">
	import { get } from 'svelte/store';
	import { user } from '$lib/user';
	import CurrentStatus from './CurrentStatus.svelte';
	import { signOut } from '$lib/utils';
	let isLoading = false;
	$: navigation = [
		{
			href: '/',
			name: 'Home'
		},
		{
			href: '/scoreboard',
			name: 'ScoreBoard'
		},
		{
			href: '/submission',
			name: 'SubmissionSatatus'
		}
	];
	const handleSignOut = async () => {
		isLoading = true;
		signOut();
		return (isLoading = false);
	};
</script>

<header class="bg-indigo-600">
	<nav class="container mx-auto">
		<div class="w-full py-4 flex items-center justify-between">
			<div class="flex items-center">
				<div class="ml-10 space-x-6">
					{#each navigation as link}
						<a href={link.href} class="text-lg font-medium text-white hover:text-indigo-50">
							{link.name}
						</a>
					{/each}
				</div>
			</div>
			<div class="text-lg font-bold">
				{get(user)?.name + '(' + get(user)?.studNo + ')'}
			</div>
			<CurrentStatus />
			<div class="ml-10 space-x-4">
				<button
					on:click={handleSignOut}
					class="inline-block bg-indigo-500 px-2 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
					disabled={isLoading}
				>
					로그아웃
				</button>
			</div>
		</div>
	</nav>
</header>
