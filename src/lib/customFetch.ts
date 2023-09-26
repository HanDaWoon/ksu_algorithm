const API_URL = 'https://ksu.dawoony.com/graphql';

export const customFetch = async <T>(url: string, opts: RequestInit | undefined): Promise<T> =>
	await fetch(`${API_URL}`, { ...opts, credentials: 'include' }).then<T>((res) => res.json());
