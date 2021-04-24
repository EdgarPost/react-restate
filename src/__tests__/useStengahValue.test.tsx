import * as React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render } from "@testing-library/react";
import { createStengah } from "../createStengah";
import { useStengahActions } from "../useStengahActions";
import { useStengahValue } from "../useStengahValue";

type Person = {
	firstName: string;
	lastName: string;
};

describe("useStengahValue", () => {
	it("should have a default value", () => {
		const counterNode = createStengah<number>(0);

		const { result } = renderHook(() => useStengahValue(counterNode));

		expect(result.current).toBe(0);
	});

	it("should have an incremented value", () => {
		const counterNode = createStengah<number>(0, {
			increment: (x: number): number => x + 1,
		});

		const nodeValueHook = renderHook(() => useStengahValue(counterNode));
		const nodeActionsHook = renderHook(() => useStengahActions(counterNode));

		act(() => nodeActionsHook.result.current.increment());

		expect(nodeValueHook.result.current).toBe(1);
	});

	it("should render the value inside a component", () => {
		const node = createStengah<string>("Hello world");

		const Component = () => useStengahValue(node);

		const { container } = render(<Component />);

		expect(container.innerHTML).toBe("Hello world");
	});

	it("should render a selection", () => {
		const node = createStengah<Person>({
			firstName: "Foo",
			lastName: "Bar",
		});

		const Component = () => useStengahValue(node, 1, (o) => o.firstName);

		const { container } = render(<Component />);

		expect(container.innerHTML).toBe("Foo");
	});

	it.only("should not re-render if the key/values if the object has not changed (shallow compare)", () => {
		const node = createStengah<Person>(
			{
				firstName: "Foo",
				lastName: "Bar",
			},
			{
				set: (prev: Person, next: Person) => next,
			},
		);

		const rerenderTracker1 = jest.fn();
		const Component = () => {
			React.useEffect(() => rerenderTracker1());

			const person = useStengahValue(node, 1);

			return (
				<p>
					{person.firstName} {person.lastName}
				</p>
			);
		};

		const rerenderTracker2 = jest.fn();
		const OtherComponent = () => {
			const { set } = useStengahActions(node, 1);

			React.useEffect(() => {
				rerenderTracker2();
				set({ firstName: "Foo", lastName: "Bar" });
			});

			return null;
		};

		const { container } = render(
			<React.Fragment>
				<Component />
				<OtherComponent />
				<OtherComponent />
				<OtherComponent />
				<OtherComponent />
			</React.Fragment>,
		);

		expect(rerenderTracker1).toHaveBeenCalledTimes(1);
		expect(rerenderTracker2).toHaveBeenCalledTimes(4);
		expect(container.innerHTML).toContain("Foo Bar");
	});

	it.only("should not re-render if the selected value has not changed", () => {
		const node = createStengah<Person>(
			{
				firstName: "Foo",
				lastName: "Bar",
			},
			{
				set: (prev: Person, next: Person) => next,
			},
		);

		const rerenderTracker1 = jest.fn();
		const Component = () => {
			React.useEffect(() => rerenderTracker1());

			return useStengahValue(node, 1, (o) => o.firstName);
		};

		const rerenderTracker2 = jest.fn();
		const OtherComponent = () => {
			const { set } = useStengahActions(node, 1);

			React.useEffect(() => {
				rerenderTracker2();
				set({ firstName: "Foo", lastName: "AnotherBar" });
			});

			return null;
		};

		const { container } = render(
			<React.Fragment>
				<Component />
				<OtherComponent />
				<OtherComponent />
				<OtherComponent />
			</React.Fragment>,
		);

		expect(rerenderTracker1).toHaveBeenCalledTimes(1);
		expect(rerenderTracker2).toHaveBeenCalledTimes(3);
		expect(container.innerHTML).toBe("Foo");
	});
});
