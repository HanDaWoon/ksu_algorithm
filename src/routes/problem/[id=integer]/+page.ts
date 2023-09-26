import type { PageLoad } from '../../$types';
import type { IProblem, IFetchResponse } from '$lib/types';
import { customFetch } from '$lib/customFetch';

export const load: PageLoad = async ({ route, fetch }) => {
	const res = await fetch('', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ problem(problemNo: ${route.id}) { no title body } }`
		}),
		credentials: 'include',
	})
		.then((res) => res.json())
		.then((res) => {
			if (res.errors) throw new Error(res.errors[0].message);
			return res.data.problem;
		})
		.catch((e: Error) => {
			return {
				title: '문제를 불러오는 데 실패했습니다',
				body: e.message
			};
		});
	const problemData = await res;

	return {
		problem: {
			title: problemData.title,
			body: problemData.body
		}
	};
};
