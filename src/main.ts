import minimist from "minimist";
import Command from "./utils/command";
import registerCommand from "./registerCommand";

const command = new Command();

registerCommand(command);

command.run(process.argv[2], minimist(process.argv.slice(3)));
