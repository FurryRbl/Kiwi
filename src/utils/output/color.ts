import chalk from 'chalk';
import { getConfig } from '../../command/config/main';

const config = getConfig();
const isColorText = config.colorText;

const colorText = (colorFunction: Function, ...text: unknown[]) => {
	return isColorText ? colorFunction(text) : text.join('');
};

export default {
	redBright: (...text: unknown[]) => colorText(chalk.redBright, text),

	cyanBright: (...text: unknown[]) => colorText(chalk.cyanBright, text),

	greenBright: (...text: unknown[]) => colorText(chalk.greenBright, text),

	blueBright: (...text: unknown[]) => colorText(chalk.blueBright, text),

	yellowBright: (...text: unknown[]) => colorText(chalk.yellowBright, text),
};
