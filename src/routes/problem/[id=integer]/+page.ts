export const ssr = false;
import { customFetch } from '$lib/customFetch';
import { get } from 'svelte/store';
import { user } from '$lib/user';
import type { IFetchResponse, IProblem, IProblemWithSubmit } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const signInUser = get(user);
	const { id } = params;
	const problemData = await customFetch<IFetchResponse<any>>({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `{ problem(no: ${id}) { no title body } problemsWithSubmit { no lang code } }`
		})
	}).then((res: IFetchResponse<any>) => {
		if (res.errors) throw new Error(res.errors[0].message);
		const { code, lang } = res.data.problemsWithSubmit.find(
			(problem: IProblemWithSubmit) => problem.no === parseInt(id)
		) || { code: '', lang: '' };

		return {
			...res.data.problem,
			code,
			lang
		};
	});
	return { problemData, signInUser };
};
