import os from "node:os";
import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";

const dataName = "kiwi-astb";
let userDataPath: string;

/**
 * 获取用户数据路径
 * @returns 用户数据路径，如果无法确定则返回 undefined
 */
export const getUserDataPath = (): string => {
	if (!userDataPath) {
		switch (os.platform()) {
			case "win32":
				if (process.env.APPDATA) {
					userDataPath = path.join(process.env.APPDATA, dataName);
				} else {
					console.log(chalk.red("无法获取用户数据存储位置，环境变量：“APPDATA”不存在，程序终止！"));
					process.exit(1);
				}
				break;
			case "darwin":
				userDataPath = path.join(os.homedir(), "Library", "Application Support", dataName);
				break;
			case "linux":
				userDataPath = path.join(os.homedir(), ".config", dataName);
				break;
			default:
				console.log(chalk.red("无法获取当前平台的用户数据存储位置，程序终止！"));
				process.exit(1);
		}
	}

	if (!fs.existsSync(userDataPath)) {
		fs.mkdirSync(userDataPath);
	}

	return userDataPath;
};
