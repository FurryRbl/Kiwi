import fs from 'node:fs';
import os from 'node:os';
import minimist from 'minimist';
import icon from '../utils/output/icon';
import color from '../utils/output/color';
import { printHelp } from '../utils/output/console';

export const showHelp = () => {
	printHelp('用法：Kiwi check');
};

export default (args: minimist.ParsedArgs): void => {
	if (args.help || args.h) {
		showHelp();
		return;
	}

	{
		const nodeVersion = process.versions.node.split('.').map(item => parseInt(item));
		if (nodeVersion[0] < 14) {
			console.warn(
				icon(
					'warning',
					color.yellowBright(
						`当前 Node.js 版本为‘${process.versions.node}’。版本过低可能导致出现问题！，请升级至 14.x 或更高版本！`,
					),
				),
			);
		} else {
			console.log(icon('success', color.greenBright(`Node.js 版本：${process.versions.node}`)));
		}
	}

	{
		const platform = os.platform();
		if (platform === 'win32' || platform === 'linux' || platform === 'darwin') {
			console.log(icon('success', color.greenBright(`系统平台：${platform}`)));
		} else {
			console.error(icon('error', color.redBright(`未知系统平台：${platform}`)));
		}
	}

	{
		// 判断能否获取用户目录
		const homedir = os.homedir();
		if (homedir) {
			console.log(icon('success', color.greenBright(`用户目录：‘${homedir}’`)));
		} else {
			console.error(icon('error', color.redBright('无法获取用户目录位置！')));
		}

		// 判断用户目录是否存在
		if (fs.existsSync(homedir)) {
			if (fs.statSync(homedir).isDirectory()) {
				console.log(icon('success', color.greenBright(`用户目录‘${homedir}’存在`)));
			} else {
				console.error(icon('error', color.redBright(`用户目录‘${homedir}’不是一个目录！`)));
			}
		}

		// 判断用户目录是否可读写
		try {
			fs.accessSync(homedir, fs.constants.R_OK);
			console.log(icon('success', color.greenBright(`用户目录‘${homedir}’可读`)));
		} catch {
			console.error(icon('error', color.redBright(`用户目录‘${homedir}’不可读！`)));
		}

		// 判断用户目录是否可写
		try {
			fs.accessSync(homedir, fs.constants.W_OK);
			console.log(icon('success', color.greenBright(`用户目录‘${homedir}’可写`)));
		} catch {
			console.error(icon('error', color.redBright(`用户目录‘${homedir}’不可写！`)));
		}
	}
};
