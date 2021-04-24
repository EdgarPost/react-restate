import { INTERNAL_DEFAULT_ID } from "../enum";
import { createStengah } from "../createStengah";

describe("createStengah", () => {
	it("should have an incremented `nodeId` ", () => {
		const node1 = createStengah(0);
		const node2 = createStengah(0);
		const node3 = createStengah(0);
		const node4 = createStengah(0);

		expect(node1.nodeId).toBe(1);
		expect(node2.nodeId).toBe(2);
		expect(node3.nodeId).toBe(3);
		expect(node4.nodeId).toBe(4);
	});

	it("should have a `getState` function that returns the initial state", () => {
		const counterNode = createStengah(5);

		expect(counterNode.getState(INTERNAL_DEFAULT_ID)).toBe(5);
	});

	it("should creates a new instance", () => {
		const counterNode = createStengah(5);

		expect(counterNode.getState(INTERNAL_DEFAULT_ID)).toBe(5);
	});

	it("should have a working instance", () => {
		const mockSet = jest.fn((x) => x);
		const counterNode = createStengah(5, { set: mockSet });

		const counterNode1 = counterNode.createInstance(INTERNAL_DEFAULT_ID);
		counterNode1.actions.set(10);

		expect(mockSet).toHaveBeenCalledTimes(1);
		expect(mockSet).toHaveBeenCalledWith(5, 10);
		expect(counterNode.getState(INTERNAL_DEFAULT_ID)).toBe(5);
	});
});
