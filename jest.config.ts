export default {
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: [
		"**/*.{ts,tsx}",
		"!**/node_modules/**",
		"!**/dist/**",
		"!**/coverage/**",
	],
	coverageDirectory: "<rootDir>coverage",
	coverageReporters: ["json", "text", "lcov", "clover"],
};
