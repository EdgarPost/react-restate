import { renderHook } from "@testing-library/react-hooks";
import { createStengah } from "../createStengah";
import { useStengahActions } from "../useStengahActions";
import { useStengahValue } from "../useStengahValue";
import { useStengah } from "../useStengah";

describe("useStengah", () => {
	it("should return a tuple of useStengahValue and useStengahActions", () => {
		const node = createStengah(0, {
			increment: jest.fn(),
			decrement: jest.fn(),
		});

		const nodeValueHook = renderHook(() => useStengahValue(node));
		const nodeActionsHook = renderHook(() => useStengahActions(node));
		const nodeHook = renderHook(() => useStengah(node));

		expect(nodeHook.result.current[0]).toBe(nodeValueHook.result.current);
		expect(Object.keys(nodeHook.result.current[1])).toEqual(
			Object.keys(nodeActionsHook.result.current),
		);
	});
});
