import fs from 'node:fs';

export default class transferParser {
	private datfileSteam: fs.ReadStream | undefined;
	private outputFileSteam: fs.ReadStream | undefined;

	constructor(dat: string, output: string) {
		this.datfileSteam = fs.createReadStream(dat);
		this.outputFileSteam = fs.createReadStream(output);
	}

	/**
	 * 关闭
	 */
	close() {
		if (this.datfileSteam) this.datfileSteam.close();
		if (this.outputFileSteam) this.outputFileSteam.close();

		this.datfileSteam = undefined;
		this.outputFileSteam = undefined;
	}

	/**
	 * 解析并运行命令
	 */
	run(command: string) {
		//
	}
}
