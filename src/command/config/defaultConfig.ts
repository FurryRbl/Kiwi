export interface Config {
	icon: boolean;
	colorText: boolean;
	logging: string;
}

export const defaultConfig: Config = {
	icon: true,
	colorText: true,
	logging: "info",
};
