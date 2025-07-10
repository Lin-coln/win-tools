import child_process from "child_process";
import electron from "electron";

const child = child_process.spawn(
  electron as any as string,
  process.argv.slice(2),
  {
    stdio: "inherit",
    windowsHide: false,
    env: {
      ...process.env,
      // export NODE_OPTIONS="--experimental-strip-types"
      NODE_OPTIONS: `--experimental-strip-types`,
    },
  },
);
child.on("close", (code, signal) => {
  if (code === null) {
    console.error(electron, "exited with signal", signal);
    process.exit(1);
  }
  process.exit(code);
});

handleTerminationSignal("SIGINT");
handleTerminationSignal("SIGTERM");
function handleTerminationSignal(signal: NodeJS.Signals) {
  process.on(signal, () => {
    if (child.killed) return;
    child.kill(signal);
  });
}
