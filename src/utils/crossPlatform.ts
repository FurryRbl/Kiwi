import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import color from './output/color';

const DATA_NAME = 'kiwi-tools';
let userDataPath: string;

/**
 * 获取用户数据路径
 * @returns 用户数据路径，如果无法获取确定则退出程序
 */
export const getUserDataPath = (): string => {
	if (userDataPath) {
		return userDataPath;
	}

	const homedir = os.homedir();

	switch (os.platform()) {
		case 'win32':
			{
				const appData = process.env.APPDATA;
				if (appData) {
					userDataPath = path.join(appData, DATA_NAME);
				} else {
					console.error(color.redBright('无法获取用户数据存储位置，环境变量：‘APPDATA’不存在，程序终止！'));
					process.exit(1);
				}
			}
			break;
		case 'darwin':
			userDataPath = path.join(homedir, 'Library', 'Application Support', DATA_NAME);
			break;
		case 'linux':
			userDataPath = path.join(homedir, '.config', DATA_NAME);
			break;
		default:
			console.error(color.redBright('无法获取当前平台的用户数据存储位置，程序终止！'));
			process.exit(1);
	}

	if (!fs.existsSync(userDataPath)) {
		fs.mkdirSync(userDataPath, { recursive: true });
	}

	return userDataPath;
};
