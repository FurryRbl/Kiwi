export interface Config {
	icon: boolean;
	colorText: boolean;
	logging: string;
}

/**
 * 默认配置文件
 */
export const defaultConfig: Config = {
	icon: true,
	colorText: true,
	logging: "info",
};

/**
 * 验证配置文件
 * @param obj 配置文件
 * @returns 验证后的配置文件
 */
export const VerifyConfig = (obj: any) => {
	const result: Partial<Config> = {};

	for (const key in defaultConfig) {
		if (obj.hasOwnProperty(key) && typeof obj[key] === typeof defaultConfig[key as keyof Config]) {
			result[key as keyof Config] = obj[key];
		}
	}

	return result as Config;
};
