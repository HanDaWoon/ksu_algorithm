const API_URL = 'http://localhost:8080/graphql';

export const customFetch = async <T>(opts: RequestInit): Promise<T> =>
	await fetch(`${API_URL}`, { ...opts, credentials: 'include' }).then<T>((res) => res.json());
