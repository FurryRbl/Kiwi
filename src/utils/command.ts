import minimist from "minimist";
import packageMetadata from "/package.json";

export default class Command {
	private commands: Map<string, { description: string; func: () => void }>;

	constructor() {
		this.commands = new Map();

		this.register("help", "显示帮助信息", this.showHelp);
	}

	/** 显示帮助信息 */
	private showHelp = (): void => {
		const help = [
			`Kiwi 版本：${packageMetadata.version}，构建日期：` + BUILD_INFO.TIME + "，构建分支：" + BUILD_INFO.GIT_BRANCH + "，提交哈希：" + BUILD_INFO.GIT_COMMIT + "\n",
			"使用：Kiwi [命令] [选项]\n",
			"所有命令：",
			...Array.from(this.commands.entries()).map(([name, { description }]) => `\t- ${name}: ${description}`),
		];

		console.log(help.join("\n"));
	};

	/** 注册一个新命令 */
	register(name: string, description: string, func: () => void): void {
		this.commands.set(name, { description, func });
	}

	/** 运行命令 */
	run(args: minimist.ParsedArgs): void {
		const commandName = args._[0];
		const command = this.commands.get(commandName);

		if (command) {
			command.func();
		} else {
			console.error(`未知的命令：${commandName}`);
		}
	}
}
