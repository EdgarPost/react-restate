import { useMemo } from "react";
import { StengahId, Stengah, StengahInstance } from "./createStengah";

export const useMemoizedStengah = (
	node: Stengah,
	id: StengahId,
): StengahInstance => useMemo(() => node.createInstance(id), [node, id]);
