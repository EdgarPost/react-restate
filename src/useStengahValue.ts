import { useCallback, useEffect, useRef, useState } from "react";
import shallowEqual from "shallowequal";
import { EVENT_UPDATE_PREFIX, INTERNAL_DEFAULT_ID } from "./enum";
import { createKey } from "./createKey";
import { eventEmitter } from "./eventEmitter";
import { useMemoizedStengah } from "./useMemoizedStengah";
import { StengahId, Stengah } from "./createStengah";

export const useStengahValue = (
	node: Stengah,
	id: StengahId = INTERNAL_DEFAULT_ID,
	select = (a: any) => a,
) => {
	const key = createKey({ nodeId: node.nodeId, id });

	const selectRef = useRef(select);

	const { state } = useMemoizedStengah(node, id);
	const [localState, setLocalState] = useState(() => selectRef.current(state));

	const setSelectedState = useCallback(
		({ state: newState, id: updatedId }) => {
			if (id !== updatedId) {
				return;
			}

			if (!shallowEqual(localState, selectRef.current(newState))) {
				setLocalState(selectRef.current(newState));
			}
		},
		[localState, selectRef, id],
	);

	useEffect(() => {
		eventEmitter.on(EVENT_UPDATE_PREFIX, setSelectedState);

		return () => {
			eventEmitter.off(EVENT_UPDATE_PREFIX, setSelectedState);
		};
	}, [key, setSelectedState]);

	useEffect(() => {
		const newState = node.getState(id);
		setSelectedState(newState);
	}, [id, node, setSelectedState]);

	return localState;
};
