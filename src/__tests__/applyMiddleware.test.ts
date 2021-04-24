import { act } from "@testing-library/react-hooks";
import { useStengah } from "../useStengah";
import { renderHook } from "@testing-library/react-hooks";
import { applyMiddleware } from "../applyMiddleware";
import { createStengah } from "../createStengah";

describe("applyMiddleware", () => {
	it("should log updates", () => {
		const node = createStengah(0, {
			increment: (x: number) => x + 1,
		});

		const middleware = jest.fn((...args) => [...args]);

		const nodeHook = renderHook(() => useStengah(node));
		applyMiddleware(middleware, node);

		act(() => nodeHook.result.current[1].increment());

		expect(middleware).toBeCalledWith(1);
	});

	it("should throw an error when a middleware is not returning a value", () => {
		const node = createStengah(0, {
			increment: (x: number) => x + 1,
		});

		const middleware = jest.fn(() => undefined);

		const nodeHook = renderHook(() => useStengah(node));
		applyMiddleware(middleware, node);

		expect(() => {
			act(() => nodeHook.result.current[1].increment());
		}).toThrow("Your middleware should return a value");
	});
});
