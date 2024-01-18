const { pathsToModuleNameMapper } = require('tsconfig-paths');
module.exports = {
	coverageDirectory: "coverage",
	preset: 'ts-jest',
	testEnvironment: "node",
	//testRegex: "(/test/.*|(\\.|/)(test|spec))\\.tsx?$"
	// moduleNameMapper: pathsToModuleNameMapper(
	// 	require('./tsconfig.json').compilerOptions.paths,
	// 	{ prefix: '<rootDir>/' }
	// ),
};