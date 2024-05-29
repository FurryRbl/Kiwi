import type Command from "./utils/command";

import config from "./command/config/config";

export default (command: Command): void => {
	command.register("config", "添加、修改、移除配置项", config);
};
