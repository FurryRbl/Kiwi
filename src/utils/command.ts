import Fuse from 'fuse.js';
import minimist from 'minimist';
import color from './output/color';
import packageMetadata from '/package.json';
import { printHelp } from './output/console';

interface CommandInfo {
	description: string;
	exports: {
		default: (args: minimist.ParsedArgs) => void;
		showHelp: () => void;
	};
	hidden?: boolean;
}

export default class Command {
	private commands: Map<string, CommandInfo>;

	constructor() {
		this.commands = new Map();

		// 默认的帮助命令
		const helpCommand = {
			description: '显示帮助信息',
			func: {
				default: this.showHelp,
				showHelp: this.showHelp,
			},
			hidden: true,
		};
		this.register('help', helpCommand.description, helpCommand.func);
		this.register('--help', helpCommand.description, helpCommand.func, true);
		this.register('-h', helpCommand.description, helpCommand.func, true);

		// 默认的版本命令
		const versionCommand = {
			description: '显示版本信息',
			func: {
				default: this.showVersion,
				showHelp: this.showVersion,
			},
			hidden: true,
		};
		this.register('version', versionCommand.description, versionCommand.func);
		this.register('--version', versionCommand.description, versionCommand.func, true);
		this.register('-v', versionCommand.description, versionCommand.func, true);
	}

	/**
	 * 显示版本信息
	 */
	private showVersion = (): void => {
		const versionInfo = [
			`Kiwi 版本：${packageMetadata.version}，构建日期：${BUILD_INFO.TIME}`,
			`构建分支：${BUILD_INFO.GIT_BRANCH}，提交哈希：${BUILD_INFO.GIT_COMMIT}，构建模式：${BUILD_INFO.BUILD_MODE}\n`,
		];
		printHelp(versionInfo);
	};

	/**
	 * 显示帮助信息
	 */
	private showHelp = (): void => {
		const allCommands = Array.from(this.commands.entries())
			.filter(([_, { hidden }]) => !hidden)
			.map(([name, { description }]) => `\t${name}: ${description}`);

		const help = ['使用：Kiwi [命令] [选项]\n', '所有命令：', ...allCommands];

		printHelp(help);
	};

	/**
	 * 注册一个新命令
	 * @param {string} name - 命令名称
	 * @param {string} description - 描述
	 * @param {CommandInfo} exports - 命令导出
	 * @param {boolean} hidden - [hidden=false] 可选参数，默认为 false。作用是隐藏当前注册的命令，例如不会出现在相似命令列表和help命令的输出中
	 * @returns {void}
	 */
	register(
		name: string,
		description: string,
		exports: {
			default: (args: minimist.ParsedArgs) => void;
			showHelp: () => void;
		},
		hidden: boolean = false,
	): void {
		this.commands.set(name.toLowerCase(), { description, exports, hidden });
	}

	/**
	 * 运行命令
	 * @param {string} name - 命令名称
	 * @param {minimist.ParsedArgs} args - 参数
	 * @returns {void}
	 */
	run(name: string | undefined, args: minimist.ParsedArgs): void {
		if (!name) {
			this.showHelp();
			return;
		}

		const command = this.commands.get(name.toLowerCase());
		if (command) {
			if (args.h || args.help || args._[0] === 'help') {
				command.exports.showHelp();
			} else {
				command.exports.default(args);
			}
			return;
		}

		const visibleCommands = Array.from(this.commands.entries())
			.filter(([_, { hidden }]) => !hidden)
			.map(([name]) => ({ item: name }));

		const fuse = new Fuse(visibleCommands, {
			keys: ['item'],
			threshold: 0.4,
		});

		const result = fuse.search(name).map(({ item }) => item);

		if (result.length > 0) {
			console.error(
				color.redBright(
					`未知的命令：‘${name}’\n你可能想要使用这些命令：${result.map(obj => obj.item).join('、')}`,
				),
			);
		} else {
			console.error(color.redBright(`未知的命令：‘${name}’`));
		}
	}
}
