import { StengahActions, Stengah, StengahId } from "./createStengah";
import { INTERNAL_DEFAULT_ID } from "./enum";
import { useMemoizedStengah } from "./useMemoizedStengah";

export const useStengahActions = (
	node: Stengah,
	id: StengahId = INTERNAL_DEFAULT_ID,
): StengahActions => {
	const { actions } = useMemoizedStengah(node, id);

	return actions;
};
