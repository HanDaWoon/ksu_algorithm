interface IFetchResponse<T> {
	data: {
		[key: string]: T;
	};
	errors?: [any];
}

interface ITry {
	[key: string]: {
		try_cnt: number;
		score: number;
	};
}

interface IStudent {
	id: number;
	studNo: string;
	password?: string;
	name?: string;
	state?: number; // 0 = 로그인 가능, 1 = 로그인 불가, 2 = 조기 퇴소
	k?: number;
	d?: number;
	a?: number;
	team?: string;
	score?: number;
	grade?: number;
	rank?: number;
	tries?: ITry;
}

interface ILoginResponse {
	success: boolean;
	message: string;
}

interface INotice {
	id: number;
	title: string;
}

interface IProblem {
	no: number;
	title: string;
	body: string;
}

interface IProblemWithSubmit {
	no: number;
	id: number;
	title?: string;
	lang: string;
	result: string;
	runtime: number;
	submit_at: string;
	score: number;
	state: string;
	type: string;
	extra: string;
	code: string;
}

interface ISubmit {
	id: number;
	stud_id: number;
	type?: string; // 0 = 실행, 1 = 제출
	problemNo: number;
	lang: string; // python, kotlin, java, c, cpp, rust, javascript
	code: string;
	state: string; // 0 = 채점 대기, 1 = 채점 중, 2 = 채점 완료
	extra: string;
	result: string; // null = 채점 상태 없음, 0 = 정답, 1 = 오답
	code_size: number;
	submit_at: string;
	runtime: number; // millisecond 단위
	score: number;
}

interface IScoreboard {
	studNo: string;
	tries: ITry;
}

interface IProblemJudgeResult {
	result: IProblemWithSubmit;
	judge: {
		testcase_id: number;
		judge_detail?: IJudgeResult[];
	}[];
}
interface IJudgeResult {
	id: number;
	submit_id: number;
	testcase_id: number;
	output: string;
	runtime: number;
	result: number;
	compile_log: string;
	memory: number;
	judge_at: string;
	judge_server_id: string;
}

interface IQuery {
	login(studNo: string, password: string): ILoginResponse;
	student(studNo: string): IStudent;
	students: IStudent[];
	notices: INotice[];
	problems: IProblem[];
	problem(no: number): IProblem;
	problemsWithSubmit: IProblemWithSubmit[];
	problemsWithSubmitByStudId(studId: number): IProblemWithSubmit[];
	submits: ISubmit[];
	submit: ISubmit[];
	info: IStudent;
	rank: IStudent[];
	scoreboard: IScoreboard[];
	judges(submitId: number): IProblemJudgeResult;
}

interface IModal {
	title: string;
	body: string;
	etc?: IProblemWithSubmit | ISubmit | undefined;
}

interface IConfig {
	START_AT: number;
	END_AT: number;
}

export type {
	IFetchResponse,
	IStudent,
	ILoginResponse,
	INotice,
	IProblem,
	IProblemWithSubmit,
	ISubmit,
	IScoreboard,
	ITry,
	IQuery,
	IModal,
	IProblemJudgeResult,
	IJudgeResult,
	IConfig
};
