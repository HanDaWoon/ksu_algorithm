<script lang="ts">
	interface IScoreCellProps {
		result: string;
		score: number;
		tries: number;
	}

	export let props: IScoreCellProps;

	$: {
		console.log(props);
	}
</script>

<div
	class="h-full w-full text-black"
	class:bg-sunglo-400={props.result === 'WRONG-ANSWER'}
	class:bg-pastel-green-400={props.result === 'CORRECT'}
	class:bg-cornflower-blue-500={props.result === 'PENDING'}
>
	<div class="text-base font-medium">
		{props.result}
	</div>
	<div>
		{props.tries === 1 ? 'try' : `${props.tries} tries`}
	</div>
</div>
