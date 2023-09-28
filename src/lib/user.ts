import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function getUserObject() {
	if (browser == false) return null;
	const studId = window.sessionStorage.getItem('user.studId');
	const studNo = window.sessionStorage.getItem('user.studNo');
	const name = window.sessionStorage.getItem('user.name');
	const team = window.sessionStorage.getItem('user.team');
	const grade = window.sessionStorage.getItem('user.grade');

	if (studId && studNo && name && team && grade) return { studId, studNo, name, team, grade };

	return null;
}

export const user = writable(getUserObject());
export function userIsLogged() {
	return getUserObject() !== null;
}
