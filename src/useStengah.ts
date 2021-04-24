import { useStengahActions } from "./useStengahActions";
import { useStengahValue } from "./useStengahValue";

export const useStengah = (...args) => [
	useStengahValue(...args),
	useStengahActions(...args),
];
