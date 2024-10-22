import fs from 'node:fs';
import type minimist from 'minimist';
import { confirm } from '@inquirer/prompts';
import color from '../../utils/output/color';
import { printHelp } from '../../utils/output/console';

export const showHelp = () => {
	printHelp('用法：Kiwi transfer2img [new.dat 文件路径] [transfer.list 文件路径] [输出路径]');
};

const version3 = (dat: string, list: string, output: string) => {
	console.log(color.cyanBright(`transfer 版本：3`));
};

const version4 = (dat: string, list: string, output: string) => {
	console.log(color.cyanBright(`transfer 版本：4`));
};

export default async (args: minimist.ParsedArgs) => {
	if (args._.length !== 3) {
		console.error(color.redBright('需要 3 个参数！\n'));
		showHelp();
		return;
	}

	if (!fs.existsSync(args._[0]) || !fs.existsSync(args._[1])) {
		console.error(color.redBright(`文件 ${!fs.existsSync(args._[0]) ? args._[0] : args._[1]} 不存在！`));
		return;
	}

	if (fs.existsSync(args._[2])) {
		const overwrite = await confirm({
			message: `'${args._[2]}'文件已存在是否覆盖？`,
			default: false,
		});

		if (!overwrite) return;
	}

	const transferVersion = parseInt(fs.readFileSync(args._[1], 'utf-8').charAt(0));

	switch (transferVersion) {
		case 3:
			version3(args._[0], args._[1], args._[2]);
			break;
		case 4:
			version4(args._[0], args._[1], args._[2]);
			break;
		default:
			console.error(color.redBright(`transfer.list 版本 ${transferVersion} 不支持！`));
			break;
	}
};
