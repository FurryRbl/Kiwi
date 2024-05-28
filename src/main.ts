import minimist from "minimist";
import Command from "./utils/command";

const command = new Command();
command.run(minimist(process.argv.slice(2)));
