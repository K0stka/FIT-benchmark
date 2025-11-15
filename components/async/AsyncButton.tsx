"use client";

import { Button, ButtonProps } from "../ui/button";
import { useCallback, useState } from "react";

import Spinner from "./Spinner";

interface PendingButtonProps extends ButtonProps {
	pending: boolean;
}

export const PendingButton = ({ pending, ...props }: PendingButtonProps) => {
	return (
		<Button
			{...props}
			disabled={pending || props.disabled}>
			{!pending ? props.children : <Spinner inline />}
		</Button>
	);
};

interface AsyncButtonProps extends Omit<ButtonProps, "onClick"> {
	onClick: () => Promise<any>;
	children: React.ReactNode;
}

export const AsyncButton = ({ onClick, children, disabled, ...props }: AsyncButtonProps) => {
	const [pending, setPending] = useState(false);

	const handleClick = useCallback(() => {
		setPending(true);
		onClick().finally(() => {
			setPending(false);
		});
	}, [onClick]);

	return (
		<PendingButton
			pending={pending}
			onClick={handleClick}
			disabled={disabled}
			{...props}>
			{children}
		</PendingButton>
	);
};
