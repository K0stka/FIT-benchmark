import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
	className?: string;
	iconOnly?: boolean;
}

const Logo = ({ className, iconOnly }: LogoProps) => {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Image
				src="/assets/fit_logo.png"
				alt="FIT logo"
				width={75}
				height={30}
				className="h-full w-auto object-contain"
			/>
			{!iconOnly && <span className="text-2xl font-semibold">Benchmark</span>}
		</div>
	);
};

export default Logo;
