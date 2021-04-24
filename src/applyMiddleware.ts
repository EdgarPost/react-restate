import { Stengah } from "./createStengah";
export const middlewares = Object.create(null);

export const applyMiddleware = <Func>(fn: Func, node: Stengah): void => {
	if (!middlewares[node.nodeId]) {
		middlewares[node.nodeId] = [];
	}

	middlewares[node.nodeId].push(fn);
};
