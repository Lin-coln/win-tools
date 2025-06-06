#!/usr/bin/env bun

import { Command } from "commander";

const cli = new Command();
cli
  .name(`exe`) //
  .description(`execute commands for the monorepo`);

getCommands().forEach((cmd) => cli.addCommand(cmd));
void cli.parseAsync(process.argv, {
  from: "node",
});

import foobar from "../src/commands/foobar";

function getCommands(): Command[] {
  return [foobar];
}
