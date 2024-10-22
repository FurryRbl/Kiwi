import chalk from 'chalk';
import { config } from '../../command/config/main';

type ColorFunction = (text: TemplateStringsArray | string | string[]) => string;

const colorText = (colorFunction: ColorFunction, ...text: unknown[]): string => {
	return (config.colorText ?? true) ? colorFunction(text.join('')) : text.join('');
};

export default {
	redBright: (...text: unknown[]) => colorText(chalk.redBright, ...text),
	cyanBright: (...text: unknown[]) => colorText(chalk.cyanBright, ...text),
	greenBright: (...text: unknown[]) => colorText(chalk.greenBright, ...text),
	blueBright: (...text: unknown[]) => colorText(chalk.blueBright, ...text),
	yellowBright: (...text: unknown[]) => colorText(chalk.yellowBright, ...text),
};
