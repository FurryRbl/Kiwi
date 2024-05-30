import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import type minimist from "minimist";
import * as defaultConfig from "./defaultConfig";
import * as crossPlatform from "../../utils/crossPlatform";

let config: defaultConfig.Config;
const configPath = path.join(crossPlatform.getUserDataPath(), "config.json");

const readLocalConfig = (): defaultConfig.Config | object => {
	if (fs.existsSync(configPath)) {
		const localConfig = fs.readFileSync(configPath, "utf-8");
		return JSON.parse(localConfig);
	} else {
		return {};
	}
};

const writeLocalCofnig = (newConfig: defaultConfig.Config): void => {
	fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4), "utf-8");
};

export const getConfig = (): defaultConfig.Config => {
	if (!config) {
		config = {
			...defaultConfig.defaultConfig,
			...readLocalConfig(),
		};
	}
	return config;
};

const parseConfigKeyValue = (input: string): [string, string | boolean | number] | undefined => {
	const [key, value] = input.split("=");
	if (!key || !value) return undefined;

	let parsedValue: string | boolean | number = value;
	if (value === "true") {
		parsedValue = true;
	} else if (value === "false") {
		parsedValue = false;
	} else if (!isNaN(Number(value))) {
		parsedValue = Number(value);
	} else {
		parsedValue = value;
	}
	return [key, parsedValue];
};

const showHelp = (): void => {
	const help = [
		"使用：Kiwi config [命令] [参数]\n",
		"命令：",
		"\tKiwi config add <key>=<value> <key>=<value> ...",
		"\tKiwi config delete <key>  <key> ...",
		"\tKiwi config list\n",
		`配置文件路径：${configPath}`,
	];

	console.log(help.join("\n"));
};

export default (args: minimist.ParsedArgs): void => {
	switch (args._[0]) {
		case "help":
			showHelp();
			break;
		case "add":
			const commandConfig: { [key: string]: string | boolean | number } = {};
			const configArgs = args._.slice(1);

			for (const configArg of configArgs) {
				const configKeyValue = parseConfigKeyValue(configArg);
				if (configKeyValue) {
					const [key, value] = configKeyValue;
					commandConfig[key] = value;
				}
			}

			const newConfig: defaultConfig.Config = {
				...readLocalConfig(),
				...defaultConfig.VerifyConfig(commandConfig),
			};
			writeLocalCofnig(newConfig);
			break;
		case "delete":
			const deletedConfig: any = readLocalConfig();
			const delConfig = args._.slice(1);

			delConfig.forEach((key) => {
				delete deletedConfig[key];
			});

			writeLocalCofnig(deletedConfig);
			break;
		case "list":
			console.log(fs.readFileSync(configPath, "utf-8"));
			console.log(`\n配置文件路径：${configPath}`);
			break;
		default:
			showHelp();
			args._[0] && console.error(chalk.red(`未知命令：‘${args._[0]}’`));
			break;
	}
};
