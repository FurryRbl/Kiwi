import fs from "fs";
import moment from "moment";
import path from "node:path";
import webpack from "webpack";
import git from "isomorphic-git";
import TerserPlugin from "terser-webpack-plugin";

const generateBuildInfo = async () => {
	const dir = process.cwd();

	const branchPromise = git.currentBranch({ fs, dir }).catch(() => "未知");
	const commitPromise = git
		.log({ fs, dir })
		.then((log) => log[0]?.oid || "未知")
		.catch(() => "未知");

	const [branch, commit] = await Promise.all([branchPromise, commitPromise]);

	return {
		TIME: JSON.stringify(moment().format("YYYY-MM-DD HH:mm:ss")),
		GIT_BRANCH: branch || "未知",
		GIT_COMMIT: commit || "未知",
	};
};

export default async (env: Object, argv: any) => {
	const isDevelopmentMode = argv.mode === "development";
	const buildInfo = await generateBuildInfo();

	const config: webpack.Configuration = {
		target: "node",
		entry: path.resolve("./src/main.ts"),
		output: {
			path: path.resolve("build"),
			libraryTarget: "commonjs",
			filename: "index.cjs",
		},
		cache: {
			type: "filesystem",
			cacheDirectory: path.resolve(".cache"),
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: ["babel-loader", "ts-loader"],
				},
				{
					test: /\.js$/,
					use: ["babel-loader"],
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
			minimize: !isDevelopmentMode,
			minimizer: [new TerserPlugin()],
		},
		plugins: [
			new webpack.ProgressPlugin(),
			new webpack.DefinePlugin({
				BUILD_INFO: JSON.stringify(buildInfo),
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
