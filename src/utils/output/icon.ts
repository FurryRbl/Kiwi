import { config } from '../../command/config/main';

export const getIcon = (icon: string): string => {
	switch (icon) {
		case 'success':
			return '✔️';
		case 'warning':
			return '⚠️';
		case 'error':
			return '❌';
		case 'question':
			return '❓';
		default:
			return '‘NotFoundIcon❓’';
	}
};

export default (icon: string, ...text: unknown[]) => {
	if (config.iconText ?? true) {
		const iconText = getIcon(icon);
		if (iconText === '‘NotFoundIcon❓’') {
			return text;
		} else {
			return `${iconText} ${text}`;
		}
	} else {
		return text;
	}
};
