import { Command } from "commander";

export default new Command("foobar").action(async () => {
  console.log("foobar command");
});
