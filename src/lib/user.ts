import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function getUserObject() {
	if (browser == false) return null;
	const studNo = window.sessionStorage.getItem('user.studNo');
	const name = window.sessionStorage.getItem('user.name');

	if (studNo && name) return { studNo, name };

	return null;
}

export const user = writable(getUserObject());
export function userIsLogged() {
	return getUserObject() !== null;
}
