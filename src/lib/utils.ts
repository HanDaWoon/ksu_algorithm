const END_TIME = new Date(2023, 9, 6, 19, 30);

export const unixTimeToDate = (unixTime: string): Date => new Date(parseInt(unixTime) * 1000);

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
