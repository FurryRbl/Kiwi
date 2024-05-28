import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: 12,
				sourceType: "module",
			},
		},
		rules: {
			eqeqeq: ["error", "always"],
		},
		ignores: ["node_modules", "/build"],
	},
];
