import { EVENT_UPDATE_PREFIX, INTERNAL_DEFAULT_ID } from "./enum";
import { middlewares } from "./applyMiddleware";
import { createKey } from "./createKey";
import { eventEmitter } from "./eventEmitter";

const states: { [key: string]: any } = {};
const actions: { [key: string]: StengahActions } = {};
let nextNodeId = 0;

export type StengahId = number | string;

export type Stengah = {
	nodeId: number;
	createInstance: CreateInstanceFn;
	getState: (arg0: StengahId) => any;
};

export type StengahActions = { [key: string]: Function | [Function, Function] };

export type StengahInstance = {
	state: any;
	actions: StengahActions;
};

type CreateInstanceFn = (id: StengahId) => StengahInstance;
type CreateStengahFn = <InitialValue>(
	initialValue: InitialValue,
	originalActions: StengahActions | void,
) => Stengah;

export const createStengah: CreateStengahFn = (
	initialValue,
	originalActions = Object.create(null),
) => {
	nextNodeId += 1;
	const nodeId = nextNodeId;

	const createInstance: CreateInstanceFn = (id = INTERNAL_DEFAULT_ID) => {
		const key = createKey({ nodeId, id });

		if (states[key]) {
			return {
				state: states[key],
				actions: actions[key],
			};
		}

		const newActions: StengahActions = Object.create(null);

		if (originalActions instanceof Object) {
			Object.keys(originalActions).forEach((actionName) => {
				const originalAction = originalActions[actionName];
				const updateState = (state) => {
					let newState = state;

					if (middlewares[nodeId]) {
						newState = middlewares[nodeId].reduce((acc, fn) => {
							const newAcc = fn(acc);

							if (newAcc === undefined) {
								throw new Error(`Your middleware should return a value.`);
							}

							return newAcc;
						}, newState);
					}

					states[key] = state;
					eventEmitter.emit(EVENT_UPDATE_PREFIX, {
						nodeId,
						key,
						state: newState,
						id,
					});
				};

				newActions[actionName] = function StengahActionProxy(...args) {
					if (Array.isArray(originalAction)) {
						const [preFn, postFn] = originalAction;

						const preFnResult = preFn(...args);

						const handleResult = (result) => {
							const prevState = states[key];
							const nextState = postFn(prevState, result);

							updateState(nextState);
						};

						if (
							preFnResult !== undefined &&
							preFnResult !== null &&
							typeof preFnResult === "object" &&
							preFnResult.then !== "function"
						) {
							return preFn(...args).then(handleResult);
						}

						throw new Error(
							"First function in the tuple must return a promise or async function.",
						);
					}

					const prevState = states[key];

					const nextState = originalAction(prevState, ...args);
					return updateState(nextState);
				};
			});
		}

		states[key] = initialValue;
		actions[key] = newActions;

		return {
			state: states[key],
			actions: actions[key],
		};
	};

	const getState = (id: StengahId) => {
		const key = createKey({ nodeId, id });

		if (!states[key]) {
			states[key] = initialValue;
		}

		return states[key];
	};

	return { nodeId, createInstance, getState };
};
