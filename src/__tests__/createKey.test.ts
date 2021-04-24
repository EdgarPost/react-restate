import { createKey } from "../createKey";

describe("createKey", () => {
	it("should create a key` ", () => {
		expect(createKey({ nodeId: 1, id: 1 })).toBe("1.1");
	});
});
