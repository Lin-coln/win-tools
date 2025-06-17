import { Webview } from "webview-bun";
const webview = new Webview(true);

webview.title = "Bun";
webview.navigate("https://bun.sh/");
webview.run();
