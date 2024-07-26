import fs from 'node:fs';
import moment from 'moment';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { getUserDataPath } from './crossPlatform';
import { getConfig } from '../command/config/main';

const currentID = nanoid(16);
export let logFileDescriptor: number;

export const initialize = (): void => {
	const logPath = path.resolve(getUserDataPath(), 'running.log');

	if (!fs.existsSync(logPath)) {
		fs.writeFileSync(logPath, '');
	} else if (!fs.statSync(logPath).isFile()) {
		fs.unlinkSync(logPath);
		fs.writeFileSync(logPath, '');
	}

	logFileDescriptor = fs.openSync(logPath, 'a');
};

const write = async (message: string): Promise<void> =>
	fs.write(logFileDescriptor, `${message}\n`, err => {
		throw err;
	});

export default class Logger {
	private readonly logName: string;

	constructor(name: string) {
		this.logName = name;
	}

	private log(message: string, level: string): void {
		const time = moment().format('YYYY-MM-DD HH:mm:ss');
		const log = `[${time}] [${level}] [${this.logName}] [${currentID}]: ${message}`;
		write(log);
	}

	public info(message: string): void {
		this.log(message, 'INFO');
	}

	public warn(message: string): void {
		this.log(message, 'WARN');
	}

	public error(message: string): void {
		this.log(message, 'ERROR');
	}

	public fatal(message: string): void {
		this.log(message, 'FATAL');
	}

	public debug(message: string): void {
		if (getConfig().debug) {
			this.log(message, 'DEBUG');
		}
	}
}
