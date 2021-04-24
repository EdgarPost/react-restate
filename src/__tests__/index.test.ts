import {
	createStengah,
	useStengahActions,
	useStengah,
	useStengahValue,
} from "..";
import { createStengah as originalcreateStengah } from "../createStengah";
import { useStengahActions as originalNodeActions } from "../useStengahActions";
import { useStengah as originaluseStengah } from "../useStengah";
import { useStengahValue as originaluseStengahValue } from "../useStengahValue";

describe("index", () => {
	it("should re-export some modules` ", () => {
		expect(createStengah).toStrictEqual(originalcreateStengah);
		expect(useStengahActions).toStrictEqual(originalNodeActions);
		expect(useStengah).toStrictEqual(originaluseStengah);
		expect(useStengahValue).toStrictEqual(originaluseStengahValue);
	});
});
