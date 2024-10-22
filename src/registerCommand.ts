import type Command from './utils/command';

import * as brotli from './command/brotli';
import * as config from './command/config/main';
import * as transfer2img from './command/transfer2img/main';
import * as vbmeta from './command/vbmeta/main';
import * as check from './command/check';

export default (command: Command): void => {
	command.register('config', '添加、修改、移除配置项', config);
	command.register('brotli', '解压/压缩后缀为 ‘.br’ 的 brotli 压缩文件', brotli);
	command.register('transfer2img', '将后缀为‘.new.dat’的文件转换为 img 文件', transfer2img);
	command.register('vbmeta', 'vbmeta相关工具', vbmeta);
	command.register('check', '检查运行环境是否兼容', check);
};
