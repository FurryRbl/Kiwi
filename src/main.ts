import minimist from 'minimist';
import Command from './utils/command';
import errorHandling from './errorHandling';
import registerCommand from './registerCommand';

errorHandling();

//throw new Error('This is a test error');

const command = new Command();
registerCommand(command);
command.run(process.argv[2], minimist(process.argv.slice(3)));
