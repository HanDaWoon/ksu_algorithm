export const ssr = false;
import { customFetch } from '$lib/customFetch';
import { get } from 'svelte/store';
import { user } from '$lib/user';
import type { IFetchResponse, ISubmit } from '$lib/types';
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
			query: `{ problem(no: ${id}) { no title body } submits { id problemNo lang code result type } }`
		})
	}).then((res: IFetchResponse<any>) => {
		if (res.errors) throw new Error(res.errors[0].message);

		const { code, lang, result } = res.data.submits
			.sort((submitA: ISubmit, submitB: ISubmit) => submitB.id - submitA.id)
			.find((submit: ISubmit) => submit.problemNo === parseInt(id)) || {
			code: '',
			lang: '',
			result: ''
		};

		return {
			...res.data.problem,
			code,
			lang,
			result
		};
	});
	return { problemData, signInUser };
};
