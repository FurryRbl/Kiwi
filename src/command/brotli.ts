import fs from "node:fs";
import chalk from "chalk";
import zlib from "node:zlib";
import inquirer from "inquirer";
import minimist from "minimist";
import ProgressBar from "progress";

const showHelp = () => {
	const help = [
		"用法：Kiwi brotli [选项] [参数]\n",
		"选项：",
		"\t-u：解压",
		"\t-c：压缩",
		"\t-o：输出位置",
		"\t--level：压缩等级，范围：0-11，默认：0，推荐3~5",
	];
	console.log(help.join("\n"));
};

const getProgressBarConfig = (total: number) => ({
	total,
	width: 30,
	complete: "=",
	incomplete: " ",
});

const handleFileNotExist = (filePath: string) => {
	console.error(chalk.red(`找不到或无法访问 ${filePath} 文件，请检查文件是否存在和权限问题！`));
};

const processDecompress = async (input: string, output: string) => {
	if (!fs.existsSync(input)) {
		handleFileNotExist(input);
		return;
	}

	if (fs.existsSync(output)) {
		const { overwrite } = await inquirer.prompt([
			{
				type: "confirm",
				name: "overwrite",
				message: `'${output}'文件已存在是否覆盖？`,
				default: false,
			},
		]);

		if (!overwrite) return;
	}

	const fileSize = fs.statSync(input).size;
	const bar = new ProgressBar("解压进度 [:bar] :percent", getProgressBarConfig(fileSize));

	const readStream = fs.createReadStream(input);
	const decompressStream = zlib.createBrotliDecompress();
	const writeStream = fs.createWriteStream(output);

	readStream.pipe(decompressStream).pipe(writeStream);

	readStream.on("data", (chunk) => {
		bar.tick(chunk.length);
	});

	writeStream.on("finish", () => {
		console.log(`文件解压成功: ${output}`);
	});

	readStream.on("error", (err) => {
		console.error(`读取文件失败: \n${err}`);
	});
	decompressStream.on("error", (err) => {
		console.error(`解压失败: \n${err}`);
	});
	writeStream.on("error", (err) => {
		console.error(`写入文件失败: \n${err}`);
	});
};

const processCompression = async (input: string, output: string, level: number) => {
	if (!fs.existsSync(input)) {
		handleFileNotExist(input);
		return;
	}

	if (fs.existsSync(output)) {
		const { overwrite } = await inquirer.prompt([
			{
				type: "confirm",
				name: "overwrite",
				message: `${output} 文件已存在是否覆盖？`,
				default: false,
			},
		]);

		if (!overwrite) return;
	}

	const fileSize = fs.statSync(input).size;
	const bar = new ProgressBar("压缩进度 [:bar] :percent", getProgressBarConfig(fileSize));

	const readStream = fs.createReadStream(input);
	const compressStream = zlib.createBrotliCompress({
		params: {
			[zlib.constants.BROTLI_PARAM_QUALITY]: level,
		},
	});
	const writeStream = fs.createWriteStream(output);

	readStream.pipe(compressStream).pipe(writeStream);

	readStream.on("data", (chunk) => {
		bar.tick(chunk.length);
	});

	writeStream.on("finish", () => {
		console.log(`文件压缩成功: ${output}`);
	});

	readStream.on("error", (err) => {
		console.error(`读取文件失败: \n${err}`);
	});
	compressStream.on("error", (err) => {
		console.error(`压缩失败: \n${err}`);
	});
	writeStream.on("error", (err) => {
		console.error(`写入文件失败: \n${err}`);
	});
};

export default (args: minimist.ParsedArgs): void => {
	if (args.help || args.h) {
		showHelp();
		return;
	}

	if (args.c && args.u) {
		console.error(chalk.red("参数‘-c’和‘-u’只能存在一个！"));
		return;
	}

	if (!args.u && !args.c) {
		console.error(chalk.red("请提供‘-c’或‘-u’任意一个参数！"));
		return;
	}

	if (!args.o) {
		console.error(chalk.red("请提供‘-o’参数！"));
		return;
	}

	if (args.c) {
		const level = args.level ? parseInt(args.level) : 0;
		processCompression(args.c, args.o, level);
	} else {
		processDecompress(args.u, args.o);
	}
};
