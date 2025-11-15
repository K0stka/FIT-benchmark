import Image from "next/image";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
	return (
		<div className={cn("flex items-center gap-2 text-2xl", className)}>
			<Image
				src="/assets/fit_logo.png"
				alt="FIT logo"
				width={75}
				height={30}
			/>
			Benchmark
		</div>
	);
};

export default Logo;
