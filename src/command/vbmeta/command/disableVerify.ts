import fs from 'node:fs';
import { showHelp } from '../main';
import { isVBMeta } from '../utils';
import { select } from '@inquirer/prompts';
import { getDisableStatus } from '../utils';
import color from '../../../utils/output/color';
import { promptForFileOverwrite } from '../../../utils/fs';

export default async (input: string, output: string): Promise<void> => {
	if (!input) {
		console.error(color.redBright('请提供 vbmeta 路径！\n'));
		showHelp();
		process.exit(1);
	} else if (!fs.existsSync(input)) {
		console.error(color.redBright('vbmeta 文件不存在！\n'));
		process.exit(1);
	} else if (!fs.statSync(input).isFile()) {
		console.error(color.redBright(`‘${input}’不是文件！`));
		process.exit(1);
	} else if (!isVBMeta(input)) {
		console.error(color.redBright(`‘${input}’不是 vbmeta 文件！\n`));
		process.exit(1);
	}

	if (!output) {
		console.error(color.redBright('请提供输出路径！\n'));
		showHelp();
		return;
	} else if (input === output) {
		console.error(color.redBright('输入和输出路径不能相同！\n'));
		process.exit(1);
	} else if (!(await promptForFileOverwrite(output))) {
		return;
	}

	const vbmetaFile = fs.openSync(input, 'r');
	const flagsBuffer = Buffer.alloc(4);
	fs.readSync(vbmetaFile, flagsBuffer, 0, 4, 120);
	fs.closeSync(vbmetaFile);

	const disableStatus = await select({
		message: `当前 vbmeta 验证禁用状态为‘${getDisableStatus(flagsBuffer.readUInt32BE())}’，请选择要设置的状态：`,
		choices: [
			{
				name: '无禁用',
				value: 0,
			},
			{
				name: '禁用镜像哈希树验证',
				value: 1,
			},
			{
				name: '禁用镜像完整性验证',
				value: 2,
			},
			{
				name: '禁用镜像哈希树验证 + 镜像完整性验证',
				value: 3,
			},
		],
	});

	fs.copyFileSync(input, output);
	const outputBuffer = fs.openSync(output, 'r+');
	flagsBuffer.writeUInt32BE(disableStatus);
	fs.writeSync(outputBuffer, flagsBuffer, 0, 4, 120);
	fs.closeSync(outputBuffer);

	console.log(
		color.greenBright(
			[
				`已成功设置 vbmeta 验证禁用状态为‘${getDisableStatus(disableStatus)}’！`, //
				`输出文件：${output}`,
			].join('\n'),
		),
	);
};
