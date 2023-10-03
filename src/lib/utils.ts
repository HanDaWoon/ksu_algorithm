import { customFetch } from './customFetch';
import type { IFetchResponse, IModal, IProblemJudgeResult } from './types';
import { user } from './user';

const END_TIME = new Date(2023, 9, 6, 19, 30);

export const calculateRemainingTime = (): string => {
	const currentTime = new Date();
	const remainingTimeInMilliseconds = END_TIME.getTime() - currentTime.getTime();

	if (remainingTimeInMilliseconds < 0) {
		return '이미 지난 시간입니다';
	}

	const remainingHours = Math.floor(Math.floor(remainingTimeInMilliseconds / (1000 * 60 * 60)));
	const remainingMinutes = Math.floor(
		(remainingTimeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
	);
	const remainingSeconds = Math.floor((remainingTimeInMilliseconds % (1000 * 60)) / 1000);

	return `${remainingHours}:${remainingMinutes}:${remainingSeconds}`;
};

export const getTimeDifferenceString = (inputTime: Date): string => {
	const currentTime = new Date();
	const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - inputTime.getTime()) / 1000);
	if (timeDifferenceInSeconds < 60) {
		return `${timeDifferenceInSeconds}초 전`;
	} else if (timeDifferenceInSeconds < 3600) {
		const minutes = Math.floor(timeDifferenceInSeconds / 60);
		return `${minutes}분 전`;
	} else {
		const hours = Math.floor(timeDifferenceInSeconds / 3600);
		return `${hours}시간 전`;
	}
};

export const handleJudges = async (submitId: number) => {
	let judges: IProblemJudgeResult;
	try {
		const response = await customFetch<IFetchResponse<IProblemJudgeResult>>({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
			judges(submitId: ${submitId}) {
				result { no id title lang result runtime memory submit_at score state type extra } 
				judge {
					testcase_id
					judge_detail { id submit_id testcase_id output runtime result compile_log memory judge_at judge_server_id }
					}
				}
			}`
			})
		});
		if (response.errors) {
			throw new Error(response.errors[0].message);
		}
		judges = response.data.judges;
	} catch (e) {
		console.log(e);
	}
	return judges;
};

export const signOut = async () => {
	window.sessionStorage.removeItem('user.studNo');
	window.sessionStorage.removeItem('user.name');
	window.sessionStorage.removeItem('user.grade');
	window.sessionStorage.removeItem('user.team');

	// cookie 삭제?
	user.set(null);
};
