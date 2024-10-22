import fs from 'node:fs';
import path from 'node:path';
import type minimist from 'minimist';
import color from '../../utils/output/color';
import { printHelp } from '../../utils/output/console';
import { getUserDataPath } from '../../utils/crossPlatform';

type ConfigType = {
	iconText?: boolean;
	colorText?: boolean;
	debug?: boolean;
	SponsorshipTips?: boolean;
	language?: string;
};

const configPath = path.join(getUserDataPath(), 'config.json');

const parseConfigKeyValue = (input: string): [key: string, value: string | boolean | number] | null => {
	const [key, value] = input.split('=');
	if (!key || value === undefined) return null;

	let parsedValue: string | boolean | number = value;
	if (value === 'true' || value === 'false') {
		parsedValue = value === 'true';
	} else if (!isNaN(Number(value))) {
		parsedValue = Number(value);
	}
	return [key as keyof ConfigType, parsedValue];
};

const readLocalConfig = (): ConfigType => {
	if (fs.existsSync(configPath)) {
		const localConfig = fs.readFileSync(configPath, 'utf-8');
		return JSON.parse(localConfig);
	}
	return {};
};

const writeLocalConfig = (newConfig: ConfigType): void => {
	fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4), 'utf-8');
};

export const showHelp = (): void => {
	const help = [
		'使用：Kiwi config [命令] [参数]\n',
		'命令：',
		'\tKiwi config add <key>=<value> <key>=<value> ...',
		'\tKiwi config delete <key> <key> ...',
		'\tKiwi config list\n',
		`配置文件路径：${configPath}`,
	];
	printHelp(help);
};

export default (args: minimist.ParsedArgs): void => {
	switch (args._[0]) {
		case 'add':
			{
				const config: { [key: string]: string | boolean | number } = readLocalConfig();

				for (const configArgs of args._.slice(1)) {
					const configKeyValue = parseConfigKeyValue(configArgs);
					if (configKeyValue) {
						const [key, value] = configKeyValue;
						config[key] = value;
					}
				}

				writeLocalConfig(config);
			}
			break;
		case 'delete':
			{
				const localConfig = readLocalConfig();

				args._.slice(1).forEach(key => {
					delete localConfig[key as keyof ConfigType];
				});

				writeLocalConfig(localConfig);
			}
			break;
		case 'list':
			console.log(readLocalConfig());
			console.log(`\n配置文件路径：${configPath}`);
			break;
		default:
			if (args._[0]) {
				console.error(color.redBright(`未知命令：‘${args._[0]}’`));
			}
			showHelp();
			break;
	}
};

export const config: ConfigType = readLocalConfig();
