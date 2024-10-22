import fs from 'node:fs';
import { confirm } from '@inquirer/prompts';

export const promptForFileOverwrite = async (filePath: string) => {
	if (fs.existsSync(filePath)) {
		const overwrite = await confirm({
			message: `‘${filePath}’文件已存在是否覆盖？`,
			default: false,
		});
		if (!overwrite) return false;
	}
	return true;
};
