module.exports = {
	testEnvironment: 'node',
	setupFilesAfterEnv: ['./jest.setup.js'],
	testMatch: ['**/__tests__/**/*.test.ts'],
	globals: {
		'process.env.TEST_DATABASE_URL': 'postgres://user:password@localhost:5432/testdb'
	},
	verbose: true,
	detectOpenHandles: true
};
