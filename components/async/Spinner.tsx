import { Loader2 } from "lucide-react";

interface SpinnerProps {
	inline?: true;
	fullscreen?: true;
}

const Spinner = ({ inline, fullscreen }: SpinnerProps) => {
	if (inline) return <Loader2 className="text-muted size-4 animate-spin" />;

	if (fullscreen) {
		return (
			<div className="flex h-dvh w-dvw items-center justify-center">
				<Loader2 className="text-muted-foreground size-6 animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex h-full w-full items-center justify-center">
			<Loader2 className="text-muted-foreground size-6 animate-spin" />
		</div>
	);
};

export default Spinner;
