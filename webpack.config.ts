import fs from 'fs';
import path from 'node:path';
import webpack from 'webpack';
import git from 'isomorphic-git';
import WebpackBar from 'webpackbar';
import { formatISO } from 'date-fns';
import type { CommonOptions } from 'esbuild';
import { EsbuildPlugin } from 'esbuild-loader';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const generateBuildInfo = async () => {
	const dir = process.cwd();

	const [branch, commit] = await Promise.all([
		git.currentBranch({ fs, dir }).catch(() => undefined),
		git
			.log({ fs, dir })
			.then(log => log[0]?.oid)
			.catch(() => undefined),
	]);

	return {
		GIT_BRANCH: branch,
		GIT_COMMIT: commit,
		TIME: formatISO(new Date(Date.now())),
	};
};

const esbuildOption: CommonOptions = {
	format: 'esm',
	target: 'es2020',
	platform: 'node',

	logLevel: 'info', // 设置了这个才有日志输出

	color: true,
	treeShaking: true,
	sourcemap: 'external',
	legalComments: 'eof', // 法律文本注释写入文件末尾
};

export default async (env: Record<string, boolean>, argv: Record<string, unknown>) => {
	const isDevelopmentMode = argv.mode === 'development';
	const buildInfo = await generateBuildInfo();

	const config: webpack.Configuration = {
		target: 'node',
		entry: path.resolve('./src/main.ts'),
		output: {
			path: path.resolve('dist'),
			filename: 'index.js',
			chunkFormat: 'module',
			library: {
				type: 'module',
			},
		},
		cache: {
			type: 'filesystem',
		},
		experiments: {
			outputModule: true,
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					loader: 'esbuild-loader',
					options: esbuildOption,
				},
				{
					test: /\.json$/,
					type: 'json',
				},
			],
		},
		optimization: {
			minimize: isDevelopmentMode ? false : true,
			minimizer: [
				new EsbuildPlugin({
					...esbuildOption,
					minify: true,
					minifySyntax: true,
					minifyWhitespace: true,
					minifyIdentifiers: true,
				}),
			],
		},
		plugins: [
			new WebpackBar({
				name: 'Kiwi',
				color: '#87cefa',
			}),
			new EsbuildPlugin({
				define: {
					BUILD_INFO: JSON.stringify({
						...buildInfo,
						BUILD_MODE: argv.mode || undefined,
					}),
				},
			}),
			new webpack.BannerPlugin({
				banner: '#!/usr/bin/env node',
				raw: true,
			}),
			env.analyze && new BundleAnalyzerPlugin(),
		],
		watch: isDevelopmentMode,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000,
			ignored: /node_modules|dist/,
		},
		devtool: 'source-map',
	};

	return config;
};
