// {
//     "compilerOptions": {
//         "target": "es6",
//         "module": "commonjs",
//         "rootDir": "src",
//         "outDir": "dist",
//         "allowJs": false,
//         "pretty": true,
//         "strictNullChecks": true,
//         "declaration": true
//     },
//     "lib":["es2017"],
//     "include": [
//         "src/**/*.ts",
//         "src/**/*.tsx",
//         "dangerfile.ts"
//     ],
//     "exclude": [
//         "dangerfile.ts",
//         "node_modules",
//         "dist"
//     ]
// }


export default {
	setEslintConfig: (config) => ({
		...config,
		extends: [
			...(config.extends),
			'@zazen/eslint-config/node',
			'@zazen/eslint-config/typescript',
		],
		rules: {
			...config.rules,
			'yoda': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'import/no-anonymous-default-export': [
				'error',
				{ allowObject: true },
			],
		},
	}),
}
