<script lang="ts">
	import type { IFetchResponse, INotice } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import { Modal } from 'flowbite-svelte';

	let currentNotice: INotice = { id: 0, title: '' };
	let modalOpen = false;

	const handleModal = (notice: INotice) => {
		currentNotice = notice;
		modalOpen = true;
	};

	$: handleNotice = customFetch<IFetchResponse<INotice[]>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ notices { id title } }`
		})
	})
		.then((res: IFetchResponse<INotice[]>) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.notices;
		})
		.catch((e: Error) => {
			alert(e);
		});
</script>

<Modal title={currentNotice.title} bind:open={modalOpen} autoclose outsideclose>
	<div class="p-4">
		<p class="text-gray-700 text-base">
			{currentNotice.id}
		</p>
	</div>
</Modal>

<div class="w-2/6">
	<h3 class="text-center text-lg bg-blue-300 font-bold border-y-2 border-black mb-4">공지사항</h3>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-lg text-center">
			<thead class="text-base text-gray-700 uppercase bg-gray-50">
				<tr>
					<th scope="col" class="px-6 py-3">no</th>
					<th scope="col" class="px-6 py-3">Title</th>
				</tr>
			</thead>
			<tbody>
				{#await handleNotice then noticeList}
					{#if noticeList}
						{#each noticeList as notice}
							<tr class="bg-white border-b" on:click={() => handleModal(notice)}>
								<th scope="row" class="px-6 py-4 whitespace-nowrap font-medium">
									{notice.id}
								</th>
								<td class="px-6 py-4 whitespace-nowrap font-medium">
									{notice.title}
								</td>
							</tr>
						{/each}
					{/if}
				{/await}
			</tbody>
		</table>
	</div>
</div>
