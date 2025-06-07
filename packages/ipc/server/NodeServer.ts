import { Server, Socket, type ServerOpts, type ListenOptions } from "node:net";
import type { Server as IServer, ServerEvents } from "../utils/types.ts";
import { EventBus } from "../utils/event.ts";
import { useBeforeMiddleware, withMiddleware } from "../utils/middleware.ts";

import listen from "./listen.ts";
import close from "./close.ts";
import disconnect from "./disconnect.ts";
import write from "./write.ts";
import PromiseHub from "../utils/PromiseHub.ts";
import QueueHub from "../utils/QueueHub.ts";

export class NodeServer extends EventBus<ServerEvents> implements IServer {
  queueHub: QueueHub;
  promiseHub: PromiseHub;
  server: Server;
  sockets: Map<string, Socket>;
  listen: (opts: ListenOptions) => Promise<this>;
  close: () => Promise<this>;
  disconnect: (this: NodeServer, id: string) => Promise<this>;
  write: (id: string, data: Buffer) => Promise<this>;

  constructor(opts: ServerOpts) {
    super();
    this.server = new Server(opts);
    this.sockets = new Map();

    this.listen = listen.bind(this) as any;
    this.close = close.bind(this) as any;
    this.disconnect = disconnect.bind(this) as any;
    this.write = write.bind(this) as any;

    // emit
    this.emit = withMiddleware(
      this.emit,
      useBeforeMiddleware(([event, ...rest]) => {
        if (event === "disconnect") {
          console.log(`[server] emit`, event, ...rest);
        } else {
          console.log(`[server] emit`, event);
        }
      }),
    );

    // promise & queue
    this.promiseHub = new PromiseHub();
    this.queueHub = new QueueHub();
    this.listen = this.promiseHub.wrapLock(this.listen, "listen");
    this.close = this.promiseHub.wrapLock(this.close, "close");
    this.write = this.queueHub.wrapQueue(this.write, (id) => `write:${id}`);
    this.disconnect = this.promiseHub.wrapLock(
      this.disconnect,
      (id) => `disconnect:${id}`,
    );
  }
}
