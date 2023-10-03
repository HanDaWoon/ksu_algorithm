<script lang="ts">
	// export let handleModal: (data: IModal) => void;

	import type { IFetchResponse, IModal, INotice } from '$lib/types';
	import { customFetch } from '$lib/customFetch';
	import { onDestroy } from 'svelte';

	let noticeList: INotice[] = [];

	const refreshNoticeData = async () => {
		try {
			const response = await customFetch<IFetchResponse<INotice[]>>({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `{ notices { id title } }`
				})
			});

			if (response.errors) {
				throw new Error(response.errors[0].message);
			}

			noticeList = response.data.notices;
		} catch (e) {
			alert(e);
		}
	};

	refreshNoticeData();
	const refreshIntervalId = setInterval(refreshNoticeData, 5000);

	onDestroy(() => clearInterval(refreshIntervalId));
</script>

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
				{#if noticeList && noticeList.length > 0}
					{#each noticeList as notice}
						<tr class="bg-white border-b">
							<th scope="row" class="px-6 py-4 whitespace-nowrap font-medium">
								{notice.id}
							</th>
							<td class="px-6 py-4 whitespace-nowrap font-medium">
								{notice.title}
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
