import color from './color';

export const printHelp = (helpMessage: string[] | string): void => {
	if (Array.isArray(helpMessage)) {
		console.log(color.blueBright(helpMessage.join('\n')));
	} else {
		console.log(color.blueBright(helpMessage));
	}
};
