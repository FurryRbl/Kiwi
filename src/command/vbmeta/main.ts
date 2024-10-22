import minimist from 'minimist';
import getInfo from './command/info';
import color from '../../utils/output/color';
import disableVerify from './command/disableVerify';
import { printHelp } from '../../utils/output/console';

export const showHelp = (): void => {
	const help = [
		'用法：Kiwi vbmeta [命令] [参数]\n',
		'命令：',
		'\tkiwi vbmeta info <vbmeta文件路径>',
		'\tkiwi vbmeta disable_verify <vbmeta文件路径> <vbmeta文件输出路径>',
	];

	printHelp(help);
};

export default (args: minimist.ParsedArgs): void => {
	switch (args._[0]) {
		case 'info':
			getInfo(args._[1]);
			break;
		case 'disable_verify':
			disableVerify(args._[1], args._[2]);
			break;
		default:
			args._[0] && console.error(color.redBright(`未知命令：‘${args._[0]}’`));
			showHelp();
			break;
	}
};
