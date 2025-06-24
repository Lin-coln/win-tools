import { type JSONValue, MessageAPI } from "../message";

export class WorkerMessageAPI extends MessageAPI {
  worker: Worker;

  constructor(worker: Worker) {
    super();
    this.worker = worker;
    worker.addEventListener("message", async (event) => {
      await this.handleMessage(event.data);
    });
    worker.addEventListener("close", () => {
      this.destroy();
    });
  }

  postMessage(msg: JSONValue): void {
    this.worker.postMessage(msg);
  }

  uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
