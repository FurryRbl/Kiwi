import type Command from "./utils/command";

import brotli from "./command/brotli";
import config from "./command/config/config";

export default (command: Command): void => {
	command.register("config", "添加、修改、移除配置项", config);
	command.register("brotli", "解压/压缩后缀为 ‘.br’ 的 brotli 压缩文件", brotli);
};
