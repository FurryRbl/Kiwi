import util from 'node:util';
import { getConfig } from '../command/config/main';

// 语言包
import en_us from '../../language/en/en_us.json';
import zh_cn from '../../language/zh/zh_cn.json';

const language = {
	en_us,
	zh_cn,
};

let languageSetting;

export const initialize = () => {
	languageSetting = getConfig().language;

	//判断language对象里是否有对应的语言包
};

export const lang = (lang: string) => {
	//
};
