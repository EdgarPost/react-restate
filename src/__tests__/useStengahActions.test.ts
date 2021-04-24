import { renderHook, act } from "@testing-library/react-hooks";
import { createStengah } from "../createStengah";
import { useStengahActions } from "../useStengahActions";
import { useStengahValue } from "../useStengahValue";

describe("useStengahActions", () => {
	it("should increment the state", () => {
		const increment = jest.fn((x) => x + 1);
		const counterNode = createStengah(0, { increment });

		const nodeValueHook = renderHook(() => useStengahValue(counterNode));
		const nodeActionsHook = renderHook(() => useStengahActions(counterNode));

		act(() => nodeActionsHook.result.current.increment());

		expect(increment).toHaveBeenCalledTimes(1);
		expect(increment).toHaveBeenCalledWith(0);

		expect(nodeValueHook.result.current).toBe(1);
	});

	it("should decrement the state", () => {
		const decrement = jest.fn((x) => x - 1);
		const counterNode = createStengah(0, { decrement });

		const nodeValueHook = renderHook(() => useStengahValue(counterNode));
		const nodeActionsHook = renderHook(() => useStengahActions(counterNode));

		act(() => nodeActionsHook.result.current.decrement());

		expect(decrement).toHaveBeenCalledTimes(1);
		expect(decrement).toHaveBeenCalledWith(0);

		expect(nodeValueHook.result.current).toBe(-1);
	});

	it("should support async actions", async () => {
		const getNumberAsync = jest.fn(
			() => new Promise((resolve) => setTimeout(() => resolve(5), 500)),
		);

		const increment = jest.fn((x, y) => x + y);

		const counterNode = createStengah(0, {
			incrementLazy: [getNumberAsync, increment],
		});

		const nodeValueHook = renderHook(() => useStengahValue(counterNode));
		const nodeActionsHook = renderHook(() => useStengahActions(counterNode));

		await act(() => nodeActionsHook.result.current.incrementLazy());

		expect(increment).toHaveBeenCalledTimes(1);
		expect(nodeValueHook.result.current).toBe(5);
	});

	it("should throw an error when the first function does not return a promise", async () => {
		const syncFn = () => null;
		const increment = jest.fn((x, y) => x + y);

		const counterNode = createStengah(0, {
			incorrectFn: [syncFn, increment],
		});

		const nodeValueHook = renderHook(() => useStengahValue(counterNode));
		const nodeActionsHook = renderHook(() => useStengahActions(counterNode));

		try {
			await act(() => nodeActionsHook.result.current.incorrectFn());
		} catch (e) {
			expect(e.message).toBe(
				"First function in the tuple must return a promise or async function.",
			);
		}
	});
});
