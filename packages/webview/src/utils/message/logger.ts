import c from "chalk";

export const logger = {
  log: (...args: any[]) => {
    console.log(c.grey(`[msg]`.padEnd(5)), ...args);
  },
  warn: (...args: any[]) => {
    console.warn(c.yellow(`[msg]`.padEnd(5)), ...args);
  },
  error: (...args: any[]) => {
    console.error(c.red(`[msg]`.padEnd(5)), ...args);
  },
};
