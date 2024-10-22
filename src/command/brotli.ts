import fs from 'node:fs';
import zlib from 'node:zlib';
import minimist from 'minimist';
import ProgressBar from 'progress';
import color from '../utils/output/color';
import { printHelp } from '../utils/output/console';
import { promptForFileOverwrite } from '../utils/fs';

export const showHelp = () => {
	const help = [
		'用法：Kiwi brotli [选项] [参数]\n',
		'选项：',
		'\t-u：解压',
		'\t-c：压缩',
		'\t-o：输出位置',
		'\t--level：压缩等级，范围：0-11，默认：0，推荐3~5',
	];
	printHelp(help);
};

const getProgressBarConfig = (total: number) => ({
	total,
	width: 30,
	complete: '=',
	incomplete: ' ',
});

const processDecompress = async (input: string, output: string) => {
	if (!fs.existsSync(input)) {
		console.error(color.redBright(`找不到或无法访问 ${input} 文件，请检查文件是否存在和权限问题！`));
		process.exit(1);
	}

	await promptForFileOverwrite(output);

	const fileSize = fs.statSync(input).size;
	const bar = new ProgressBar('解压进度 [:bar] :percent', getProgressBarConfig(fileSize));

	const readStream = fs.createReadStream(input);
	const decompressStream = zlib.createBrotliDecompress();
	const writeStream = fs.createWriteStream(output);

	readStream.pipe(decompressStream).pipe(writeStream);

	readStream.on('data', chunk => {
		bar.tick(chunk.length);
	});

	writeStream.on('finish', () => {
		console.log(`文件解压成功: ${output}`);
	});

	readStream.on('error', err => {
		console.error(`读取文件失败: \n${err}`);
		process.exit(1);
	});
	decompressStream.on('error', err => {
		console.error(`解压失败: \n${err}`);
		process.exit(1);
	});
	writeStream.on('error', err => {
		console.error(`写入文件失败: \n${err}`);
		process.exit(1);
	});
};

const processCompression = async (input: string, output: string, level: number) => {
	if (!fs.existsSync(input)) {
		console.error(color.redBright(`找不到或无法访问 ${input} 文件，请检查文件是否存在和权限问题！`));
		process.exit(1);
	}

	await promptForFileOverwrite(output);

	console.log(`压缩等级：${level}`);

	const fileSize = fs.statSync(input).size;
	const bar = new ProgressBar('压缩进度 [:bar] :percent', getProgressBarConfig(fileSize));

	const readStream = fs.createReadStream(input);
	const compressStream = zlib.createBrotliCompress({
		params: {
			[zlib.constants.BROTLI_PARAM_QUALITY]: level,
		},
	});
	const writeStream = fs.createWriteStream(output);

	readStream.pipe(compressStream).pipe(writeStream);

	readStream.on('data', chunk => {
		bar.tick(chunk.length);
	});

	writeStream.on('finish', () => {
		console.log(`文件压缩成功: ${output}`);
	});

	readStream.on('error', err => {
		console.error(`读取文件失败: \n${err}`);
		process.exit(1);
	});
	compressStream.on('error', err => {
		console.error(`压缩失败: \n${err}`);
		process.exit(1);
	});
	writeStream.on('error', err => {
		console.error(`写入文件失败: \n${err}`);
		process.exit(1);
	});
};

export default (args: minimist.ParsedArgs): void => {
	if (args.help || args.h) {
		showHelp();
		return;
	}

	if (args.c && args.u) {
		console.error(color.redBright('参数‘-c’和‘-u’只能存在一个！'));
		process.exit(1);
	}

	if (!args.u && !args.c) {
		console.error(color.redBright('请提供‘-c’或‘-u’任意一个参数！'));
		process.exit(1);
	}

	if (!args.o) {
		console.error(color.redBright('请提供‘-o’参数！'));
		process.exit(1);
	}

	if (args.c) {
		const level = args.level ? parseInt(args.level) : 0;
		processCompression(args.c, args.o, level);
	} else {
		processDecompress(args.u, args.o);
	}
};
