import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { format } from 'date-fns';
import packageMetadata from '/package.json';

const errorHandling = (description: string, error: Error): void => {
	const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
	const logPath = path.resolve(os.tmpdir(), `kiwi-astb_crash_report_${timestamp}.log`);

	const logData = [
		`---- Kiwi Crash Report ----\n`,
		`Time: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\n`,
		`Description: ${description}\n`,
		`-- Stack --\n`,
		`${error.stack?.replace(/\n/g, '\n\t')}\n`,
		`-- System Details --\n`,
		`Process ID: ${process.pid}\n`,
		`Platform: ${process.platform}\n`,
		`Architecture: ${process.arch}\n`,
		`Memory Usage: ${JSON.stringify(process.memoryUsage())}\n`,
		`Uptime: ${process.uptime()}\n`,
		`Version:\n`,
		`Kiwi Version: ${packageMetadata.version}\n`,
		`Kiwi Build Branch: ${BUILD_INFO.GIT_BRANCH}\n`,
		`Kiwi Build Commit: ${BUILD_INFO.GIT_COMMIT}\n`,
		`Kiwi Build Time: ${BUILD_INFO.TIME}\n`,
		`HTTP Parser Version: ${process.versions.http_parser}\n`,
		`Node Version: ${process.versions.node}\n`,
		`V8 Version: ${process.versions.v8}\n`,
		`Ares Version: ${process.versions.ares}\n`,
		`UV Version: ${process.versions.uv}\n`,
		`Zlib Version: ${process.versions.zlib}\n`,
		`Modules Version: ${process.versions.modules}\n`,
		`OpenSSL Version: ${process.versions.openssl}\n`,
	].join('');

	fs.writeFileSync(logPath, logData);
	console.error(`Error information has been collected and saved in: ${logPath}`);

	process.exit(1);
};

export default () => {
	if (parseInt(process.versions.node.split('.')[0]) < 20) {
		console.error('Node.js version is too low. Please upgrade to version 20.0.0 or higher.');
		process.exit(1);
	}

	process.on('uncaughtException', (error: Error) => errorHandling('Uncaught exception', error));
	process.on('unhandledRejection', (error: Error) => errorHandling('Unhandled rejection', error));
};
