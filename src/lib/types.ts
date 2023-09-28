interface IFetchResponse<T> {
	data: {
		[key: string]: T;
	};
	errors?: [any];
}

interface INotice {
	id: number;
	title: string;
}

interface IProblem {
	no: string;
	title: string;
	body: string;
}

interface ISubmit {
	id: number;
	stud_id: number;
	type: string; // 실행 or 제출
	problemNo: number;
	lang: string;
	code: string;
	state: string; // 체점 중 or 체점 완료
	extra: string; // 세부 사항 들
	result: string; // 결과 (정답 or 오답)
}

interface INotice {
	id: number;
	title: string;
}

interface IStudent {
	id: number;
	studNo: string;
	name: string;
	state: string; // 0: 로그인 가능, 1: 불가능, 2: 조기퇴실
	k: number; // 맞은 문제 수
	d: number; // 틀린 문제 수
	a: number; // pending 문제 수
	team: string;
	score: number;
	grade: number;
}

interface ILoginResult {
	success: boolean;
	message: string;
}

interface IMutation {
	updateStudent(state: string, k: number, d: number, a: number): IStudent;
	updateSubmit(
		stud_id: number,
		type: string,
		problemNo: number,
		lang: String,
		code: String,
		state: String,
		extra: String,
		result: String
	): ISubmit;
}

export type { IFetchResponse, ILoginResult, INotice, IMutation, IStudent, ISubmit, IProblem };
