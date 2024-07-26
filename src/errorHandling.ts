import fs from 'node:fs';
import os from 'node:os';
import moment from 'moment';
import path from 'node:path';
import packageMetadata from '/package.json';

const errorHandling = (Description: string, error: Error): void => {
	const logPath = path.resolve(os.tmpdir(), `kiwi-astb_crash_report${moment().format('YYYY-MM-DD-HH-mm-ss')}.log`);

	console.error(`A serious error has occurred, and error information is being collected!\n`);

	const logFileDescriptor = fs.openSync(logPath, 'w');

	fs.writeSync(logFileDescriptor, `---- Kiwi Crash Report ----\n\n`);

	fs.writeSync(logFileDescriptor, `Time: ${moment().format('YYYY-MM-DD HH:mm:ss')}\n`);
	fs.writeSync(logFileDescriptor, `Description: ${Description}\n\n`);

	fs.writeSync(logFileDescriptor, `-- Stack --\n`);
	fs.writeSync(logFileDescriptor, `${error.stack?.replace(/\n/g, '\n\t')}\n\n`);

	fs.writeSync(logFileDescriptor, `-- System Details --\n`);
	fs.writeSync(logFileDescriptor, `Details:\n`);
	fs.writeSync(logFileDescriptor, `\tProcess ID: ${process.pid}\n`);
	fs.writeSync(logFileDescriptor, `\tPlatform: ${process.platform}\n`);
	fs.writeSync(logFileDescriptor, `\tArchitecture: ${process.arch}\n`);
	fs.writeSync(logFileDescriptor, `\tMemory Usage: ${JSON.stringify(process.memoryUsage())}\n`);
	fs.writeSync(logFileDescriptor, `\tUptime: ${process.uptime()}\n`);

	fs.writeSync(logFileDescriptor, `Version:\n`);
	fs.writeSync(logFileDescriptor, `\tKiwi Version: ${packageMetadata.version}\n`);
	fs.writeSync(logFileDescriptor, `\tKiwi Build Branch: ${BUILD_INFO.GIT_BRANCH}\n`);
	fs.writeSync(logFileDescriptor, `\tKiwi Build Commit: ${BUILD_INFO.GIT_COMMIT}\n`);
	fs.writeSync(logFileDescriptor, `\tKiwi Build Time: ${BUILD_INFO.TIME}\n\n`);

	fs.writeSync(logFileDescriptor, `\tHTTP Parser Version: ${process.versions.http_parser}\n`);
	fs.writeSync(logFileDescriptor, `\tNode Version: ${process.versions.node}\n`);
	fs.writeSync(logFileDescriptor, `\tV8 Version: ${process.versions.v8}\n`);
	fs.writeSync(logFileDescriptor, `\tAres Version: ${process.versions.ares}\n`);
	fs.writeSync(logFileDescriptor, `\tUV Version: ${process.versions.uv}\n`);
	fs.writeSync(logFileDescriptor, `\tZlib Version: ${process.versions.zlib}\n`);
	fs.writeSync(logFileDescriptor, `\tModules Version: ${process.versions.modules}\n`);
	fs.writeSync(logFileDescriptor, `\tOpenSSL Version: ${process.versions.openssl}\n`);

	fs.closeSync(logFileDescriptor);
	console.error(`Error information has been collected and saved in: ${logPath}`);

	process.exit(1);
};

export default () => {
	if (process.versions.node.split('.').map(Number)[0] < 20) {
		console.error('node 版本过低，请升级至 20.0.0 或更高版本');
		process.exit(1);
	}

	process.on('uncaughtException', (error: Error) => errorHandling('Uncaught exception', error));
	process.on('unhandledRejection', (error: Error) => errorHandling('Unhandled rejection', error));
};
