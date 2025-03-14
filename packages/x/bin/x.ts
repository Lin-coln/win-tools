#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import url from "url";
import path from "path";

const cli = new Command();
cli
  .name(`x`) //
  .description(`windows tools for myself`);

const commands = await getCommands();
commands.forEach((cmd) => cli.addCommand(cmd));
void cli.parseAsync(process.argv, { from: "node" });

async function getCommands(): Promise<Command[]> {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const commandDirname = path.join(__dirname, "../src/commands");
  const files = await fs.promises.readdir(commandDirname);
  return await Promise.all(
    files.map(async (file) =>
      import(
        url.pathToFileURL(path.join(commandDirname, file)).toString()
      ).then((mod) => mod.default),
    ),
  );
}
