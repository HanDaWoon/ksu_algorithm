export const ssr = false;
import { customFetch } from '$lib/customFetch';
import type { IFetchResponse, IProblem } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { id } = params;
	const problemData = await customFetch<IFetchResponse<IProblem>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ problem(no: ${id}) { no title body } }`
		})
	}).then((res: IFetchResponse<IProblem>) => {
		if (res.errors) throw new Error(res.errors[0].message);
		return res.data;
	});
	return problemData;
};
