export interface Config {
	iconText: boolean;
	colorText: boolean;
	debug: boolean;
	SponsorshipTips: boolean;
	language: string;
}

/**
 * 默认配置文件
 */
export const defaultConfig: Config = {
	iconText: true,
	colorText: true,
	debug: false,
	SponsorshipTips: true,
	language: 'en_us',
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
