import { useCallback, useState } from "react";

import { ActionResponse } from "@/lib/action";
import { toast } from "sonner";

type ReturnTypeData<V> = {
	result: "data";
	data: V;
};

type ReturnTypeActionResponse = {
	result: ActionResponse["type"];
};

type ReturnType<V> = ReturnTypeData<V> | ReturnTypeActionResponse;

export const useAction = <Args extends any[], V>(
	action: (...args: Args) => Promise<V | ActionResponse>
): {
	pending: boolean;
	action: (...args: Args) => Promise<ReturnType<V>>;
} => {
	const [pending, setPending] = useState(false);

	const executeAction = useCallback(
		async (...args: Args): Promise<ReturnType<V>> => {
			if (pending) {
				toast.warning("Počkejte, prosím, na dokončení předchozí akce.");
				throw new Error("Action is already pending");
			}

			setPending(true);

			const result = await action(...args);

			setPending(false);

			if (typeof result === "object" && "type" in (result as object) && "message" in (result as object)) {
				switch ((result as ActionResponse).type) {
					case "success":
						toast.success((result as ActionResponse).message);
						break;
					case "user_error":
						toast.warning((result as ActionResponse).message);
						break;
					case "server_error":
						toast.error("Během zpracovávání požadavku došlo k neočekávané chybě", {
							description: (result as ActionResponse).message || "Zkuste to prosím znovu později.",
						});
						break;
				}

				return {
					result: (result as ActionResponse).type,
				};
			}

			return {
				result: "data",
				data: result as V,
			};
		},
		[pending, action]
	);

	return {
		pending,
		action: executeAction,
	};
};
