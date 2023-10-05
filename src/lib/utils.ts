import { customFetch } from './customFetch';
import type { IFetchResponse, IModal, IProblemJudgeResult } from './types';
import { user } from './user';

export const convertTimestampToKoreanTime = (timestamp: number) => {
	const koreanTimezoneOffset = 9 * 60; // Korea Standard Time (KST) offset in minutes
	const timestampInMilliseconds = timestamp * 1000; // Convert seconds to milliseconds
	const koreanTimestamp = new Date(timestampInMilliseconds + koreanTimezoneOffset * 60 * 1000);

	// Formatting the date and time in the desired format (e.g., "2023-10-04 14:30:00")
	const formattedTime = koreanTimestamp.toISOString().replace(/T/, ' ').replace(/\..+/, '');

	return formattedTime;
};

export const calculateRemainingTime = (timestamp: number): string => {
	const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
	const remainingTimeInSeconds = timestamp - currentTime;

	if (remainingTimeInSeconds < 0) {
		return '이미 지난 시간입니다';
	}

	const remainingHours = Math.floor(remainingTimeInSeconds / 3600);
	const remainingMinutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
	const remainingSeconds = remainingTimeInSeconds % 60;

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

export function escapeSpecialChars(str: string) {
	return str
		.replace(/\\/g, '\\\\') // escape backslashes first
		.replace(/\n/g, '\\n') // escape newlines
		.replace(/\r/g, '\\r') // escape carriage returns
		.replace(/\t/g, '\\t') // escape tabs
		.replace(/"/g, '\\"'); // escape quotes
}

export function unescapeSpecialChars(str: string) {
	return str
		.replace(/\\\\/g, '\\') // unescape backslashes
		.replace(/\\n/g, '\n') // unescape newlines
		.replace(/\\r/g, '\r') // unescape carriage returns
		.replace(/\\t/g, '\t') // unescape tabs
		.replace(/\\"/g, '"'); // unescape quotes
}
