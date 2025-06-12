import { Webview } from "webview-bun";
import { APP_PACKAGED, APP_PATH, PORT } from "./constants.ts";

interface Config {
  name: string;
  url: string;
}

class App {
  config!: Config;
  webview!: Webview;
  worker!: Worker;

  constructor(config: Config) {
    this.config = config;

    let _launchPromise: Promise<void> | null = null;
    const _launch = this.launch.bind(this);
    this.launch = () => {
      if (!_launchPromise) _launchPromise = _launch();
      return _launchPromise;
    };

    let _quitPromise: Promise<void> | null = null;
    const _quit = this.quit.bind(this);
    this.quit = () => {
      if (!_quitPromise) _quitPromise = _quit();
      return _quitPromise;
    };
  }

  protected async onInitialize() {
    const worker = new Worker(
      APP_PACKAGED ? "./worker.ts" : "./main/worker.ts",
      {
        env: Object.fromEntries(
          Object.entries({
            PORT,
            APP_PATH,
            APP_PACKAGED,
          }).map((x) => [x[0], JSON.stringify(x[1])]),
        ),
      },
    );
    worker.addEventListener("close", () => this.quit());
    this.worker = worker;
    this.webview = new Webview(true);
  }

  protected async onCreateWindow(webview: Webview) {
    const cfg = this.config;
    webview.title = cfg.name;
    webview.navigate(cfg.url);
    webview.bind("postMessageBun", (...args: any[]) => {
      console.log("Received postMessageBun", ...args);
      return "from main-process";
    });
    webview.run();
    await this.quit();
  }

  async launch() {
    await this.onInitialize();
    await this.onCreateWindow(this.webview);
  }

  async quit() {
    console.log("app quit ...");
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    this.webview.destroy();
    this.worker.terminate();
  }
}

const app = new App({
  name: "Bun",
  url: `http://localhost:${PORT}`,
  // url: `https://bun.sh/`,
});
app.launch();
