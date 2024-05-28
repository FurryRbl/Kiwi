import moment from "moment";
import path from "node:path";
import webpack from "webpack";
import simpleGit from "simple-git";
import TerserPlugin from "terser-webpack-plugin";

const generateBuildInfo = () => {
	const git = simpleGit();

	console.log(git.branchLocal());

	return {
		TIME: JSON.stringify(moment().format("YYYY-MM-DD HH:mm:ss")),
		GIT_BRANCH: git.branchLocal(),
		GIT_COMMIT: git.revparse(["HEAD"]),
	};
};

export default (env: Object, argv: any) => {
	const isDevelopmentMode = argv.mode === "development";

	const config: webpack.Configuration = {
		target: "node",
		entry: path.resolve("./src/main.ts"),
		output: {
			path: path.resolve("build"),
			libraryTarget: "commonjs",
			filename: "index.cjs",
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		module: {
			rules: [
				{
					test: /\.(ts|js)$/,
					use: ["babel-loader", "ts-loader"],
				},
				{
					test: /\.node$/,
					use: ["node-loader"],
				},
				{
					test: /\.json$/,
					type: "json",
				},
			],
		},
		optimization: {
			minimize: isDevelopmentMode ? false : true,
			minimizer: [new TerserPlugin()],
		},
		plugins: [
			new webpack.ProgressPlugin(),
			new webpack.DefinePlugin({
				BUILD_INFO: generateBuildInfo(),
			}),
		],
		watch: isDevelopmentMode,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000,
			ignored: /node_modules|build/,
		},
		devtool: isDevelopmentMode ? "source-map" : false,
	};

	return config;
};
