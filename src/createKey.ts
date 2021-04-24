import { StengahId } from "./createStengah";

export const createKey = ({
	nodeId,
	id,
}: {
	nodeId: number;
	id: StengahId;
}): string => `${nodeId}.${id}`;
