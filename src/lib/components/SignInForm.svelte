<script lang="ts">
	import { browser } from '$app/environment';
	import { user } from '$lib/user';
	import { writable } from 'svelte/store';
	import { customFetch } from '$lib/customFetch';
	import type { IFetchResponse, ILoginResult, IStudent } from '$lib/types';

	let isLoading = false;
	let msg: string = '';
	let studNo!: string;
	let password!: string;

	const handleSignIn = async () => {
		isLoading = true;
		await customFetch<IFetchResponse<ILoginResult>>('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{ login(studNo: "${studNo}", password: "${password}") { success message } }`
			})
		})
			.then((res: IFetchResponse<ILoginResult>) => {
				if (res.errors) {
					throw new Error(res.errors[0].message);
				}
				return res.data.login;
			})
			.then(async (login: ILoginResult) => {
				if (!login.success) {
					throw new Error(login.message);
				} else {
					await handleGetStd();
					isLoading = false;
				}
			})
			.catch((e: Error) => {
				msg = '로그인에 실패하였습니다.\n' + e.message;
				isLoading = false;
			});
	};

	const handleGetStd = async () =>
		await customFetch<IFetchResponse<IStudent>>('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{ info { studNo name state team grade } }`
			})
		})
			.then((res: IFetchResponse<IStudent>) => {
				if (res.errors) {
					throw new Error(res.errors[0].message);
				}
				return res.data.info;
			})
			.then((info: IStudent) => {
				const studNo = info.studNo;
				const name = info.name;
				const team = info.team;
				const grade = info.grade.toString();
				if (parseInt(info.state) === 0) {
					writable(null).subscribe(() => {
						if (browser) {
							window.sessionStorage.setItem('user.studNo', studNo);
							window.sessionStorage.setItem('user.name', name);
							window.sessionStorage.setItem('user.team', team);
							window.sessionStorage.setItem('user.grade', grade);
						}
					});
					user.set({ studNo, name, team, grade });
					return;
				}
				throw new Error('유저 확인 실패');
			})
			.catch((e: Error) => {
				console.log(e.message);
			});
</script>

<div class="mt-56 sm:mx-auto sm:w-full sm:max-w-sm">
	{#if msg != ''}
		<article>
			<div
				class="p-4 mb-4 text-lg text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
				role="alert"
			>
				{msg}
			</div>
		</article>
	{/if}
	<form method="POST" class="space-y-6" on:submit|preventDefault={handleSignIn}>
		<div>
			<label for="studNo" class="block text-sm font-medium leading-6 text-gray-900">학번</label>
			<div class="mt-2">
				<input
					type="text"
					name="studNo"
					id="studNo"
					bind:value={studNo}
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					disabled={isLoading}
					required
				/>
			</div>
		</div>
		<div>
			<label for="password" class="block text-sm font-medium leading-6 text-gray-900">
				비밀번호
			</label>
			<div class="mt-2">
				<input
					type="password"
					name="password"
					id="password"
					bind:value={password}
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					disabled={isLoading}
					required
				/>
			</div>
		</div>
		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				disabled={isLoading}
			>
				{isLoading ? '로그인 중' : '로그인'}
			</button>
		</div>
	</form>
</div>
