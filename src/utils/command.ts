import Fuse from "fuse.js";
import minimist, { ParsedArgs } from "minimist";
import packageMetadata from "/package.json";

interface CommandOptions {
	description: string;
	func: (args: ParsedArgs) => void;
}

interface BuildInfo {
	TIME: string;
	GIT_BRANCH: string;
	GIT_COMMIT: string;
}

declare const BUILD_INFO: BuildInfo;

export default class Command {
	private commands: Map<string, { description: string; func: (args: minimist.ParsedArgs) => void; hidden?: boolean }>;

	constructor() {
		this.commands = new Map();

		this.register("help", "显示帮助信息", this.showHelp);
		this.register("--help", "显示帮助信息", this.showHelp, true);
		this.register("-h", "显示帮助信息", this.showHelp, true);

		this.register("version", "显示版本信息", this.showVersion);
		this.register("--version", "显示版本信息", this.showVersion, true);
		this.register("-v", "显示版本信息", this.showVersion, true);
	}

	private showVersion = (): void => {
		const version = [
			"Kiwi 版本：" + packageMetadata.version + "，构建日期：" + BUILD_INFO.TIME,
			"构建分支：" + BUILD_INFO.GIT_BRANCH + "，提交哈希：" + BUILD_INFO.GIT_COMMIT + "\n",
		];

		console.log(version.join("\n"));
	};

	/** 显示帮助信息 */
	private showHelp = (): void => {
		const allCommands = Array.from(this.commands.entries())
			.filter(([_, { hidden }]) => !hidden)
			.map(([name, { description }]) => "\t" + name + ": " + description);

		const help = [
			"使用：Kiwi [命令] [选项]\n", //
			"所有命令：",
			...allCommands,
		];

		this.showVersion();
		console.log(help.join("\n"));
	};

	/**
	 * 注册一个新命令
	 * @param {string} name - 命令名称
	 * @param {string} description - 描述
	 * @param {() => void} func - 命令函数
	 * @param {boolean} hidden - [hidden=false] 可选参数，默认为 false。作用是隐藏当前注册的命令，例如不会出现在相似命令列表和help命令的输出中
	 * @returns {void}
	 */
	register(name: string, description: string, func: (args: minimist.ParsedArgs) => void, hidden: boolean = false): void {
		this.commands.set(name, { description, func, hidden });
	}

	/**
	 * 运行命令
	 * @param {string} name - 命令名称
	 * @param {string} args - 参数
	 * @returns {void}
	 */
	run(name: string | undefined, args: minimist.ParsedArgs): void {
		if (!name) {
			this.showHelp();
			return;
		}

		const command = this.commands.get(name);

		if (command) {
			command.func(args);
		} else {
			const commandsArray = Array.from(this.commands.entries())
				.filter(([_, { hidden }]) => !hidden)
				.map(([name, _]) => ({ item: name }));

			const fuse = new Fuse(commandsArray, {
				keys: ["item"],
				threshold: 0.9,
			});

			const result = fuse.search(name).map(({ item }) => item); // 提取搜索结果中的命令名称

			if (result.length > 0) {
				console.error(`未知的命令：‘${name}’\n你可能想要使用这些命令：${result.map((item) => item.item).join(", ")}`);
			} else {
				console.error(`未知的命令：‘${name}’`);
			}
		}
	}
}
