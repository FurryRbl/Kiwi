import minimist from 'minimist';
import Command from './utils/command';
import * as logging from './utils/logging';
import errorHandling from './errorHandling';
import registerCommand from './registerCommand';

errorHandling();
logging.initialize();

const command = new Command();
registerCommand(command);
command.run(process.argv[2], minimist(process.argv.slice(3)));
