import fs from "node:fs";
import path from "node:path";
import type minimist from "minimist";
import * as defaultConfig from "./defaultConfig";
import * as crossPlatform from "../../utils/crossPlatform";

let config: defaultConfig.Config;
const configPath = path.join(crossPlatform.getUserDataPath(), "config.json");

const getLocalConfig = (): defaultConfig.Config | Object => {
	if (fs.existsSync(configPath)) {
		const localConfig = fs.readFileSync(configPath, "utf-8");
		return JSON.parse(localConfig);
	} else {
		return {};
	}
};

export const getConfig = (): defaultConfig.Config => {
	if (!config) {
		config = {
			...defaultConfig.defaultConfig,
			...getLocalConfig(),
		};
	}
	return config;
};

function parsingSConfig(input: string): [string, string | boolean | number] | undefined {
	const index = input.indexOf("=");

	if (index === -1) {
		return undefined;
	}

	const key = input.substring(0, index);
	let value: string | boolean | number = input.substring(index + 1);

	if (value === "true") {
		value = true;
	} else if (value === "false") {
		value = false;
	} else if (!isNaN(Number(value))) {
		value = Number(value);
	} else {
		value = value;
	}

	return [key, value];
}

const showHelp = (): void => {
	//
};

export default (args: minimist.ParsedArgs): void => {
	crossPlatform.getUserDataPath();

	switch (args._[0]) {
		case "add":
			const commandConfig: { [key: string]: string | boolean | number } = {};
			const configArgs = args._.slice(1);

			for (let i = 0; i < configArgs.length; i++) {
				const config = parsingSConfig(configArgs[i]);
				if (config) {
					commandConfig[config[0]] = config[1];
				}
			}

			const config = JSON.stringify(
				{
					...getLocalConfig(),
					...commandConfig,
				},
				null,
				4,
			);

			fs.writeFileSync(configPath, config, "utf-8");
			break;
		case "delete":
			console.log("This is an apple.");
			break;
		case "list":
			console.log("This is an orange.");
			break;
		default:
			showHelp();
	}
};
