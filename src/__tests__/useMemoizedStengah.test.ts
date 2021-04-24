import { renderHook, act } from "@testing-library/react-hooks";
import { createStengah } from "../createStengah";
import { useMemoizedStengah } from "../useMemoizedStengah";

describe("useMemoizedStengah", () => {
	it("should increment the state", () => {
		const node = createStengah(0);

		const hookResult = renderHook(() => useMemoizedStengah(node, 1));
		const beforeValue = hookResult.result.current;

		act(() => hookResult.rerender());

		const afterValue = hookResult.result.current;

		expect(beforeValue).toBe(afterValue);
	});
});
