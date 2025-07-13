import type { Binary } from "./types";

export namespace MessagePeer {
  export interface Options {
    identifier: string;
    listen?: (callback: ConnEventHandler) => Promise<void>;
    connect: (dest: string, callback: ConnEventHandler) => Promise<Conn>;
    handleData: (origin: string, data: Binary) => Promise<void>;
    shutdown?: () => Promise<void>;
  }

  export interface Conn {
    id: string;
    remote: string;
    send: (bin: Binary) => Promise<void>;
    disconnect: () => Promise<void>;
    getPriority?: () => number;
  }

  export type ConnEvent =
    | { type: "connect"; conn: Conn }
    | { type: "data"; conn: Conn; data: Binary }
    | { type: "disconnect"; connId: string };

  type ConnEventHandler = (event: ConnEvent) => Promise<void>;
}

export interface MessagePeer {
  readonly identifier: string;
  connect(dest: string): Promise<string>;
  send(dest: string, bin: Binary): Promise<void>;
  disconnect(dest: string): Promise<void>;
  shutdown(): Promise<void>;
}

export async function createMessagePeer(
  opts: MessagePeer.Options,
): Promise<MessagePeer> {
  const identifier = opts.identifier;
  const connMap = new Map<string, MessagePeer.Conn>();

  await opts.listen?.(handleConnEvent);

  return {
    identifier,
    connect,
    disconnect,
    shutdown,
    send,
  };

  async function connect(dest: string) {
    const conn = await opts.connect(dest, handleConnEvent);
    return conn.id;
  }

  async function disconnect(dest: string) {
    const ls = Array.from(connMap.values()).filter((x) => x.remote === dest);
    await Promise.all(ls.map((x) => x.disconnect()));
  }

  async function shutdown() {
    await Promise.all(Array.from(connMap.values()).map((x) => x.disconnect()));
    await opts.shutdown?.();
  }

  async function handleConnEvent(event: MessagePeer.ConnEvent) {
    if (event.type === "connect") {
      connMap.set(event.conn.id, event.conn);
    } else if (event.type === "data") {
      await opts.handleData(event.conn.remote, event.data);
    } else if (event.type === "disconnect") {
      connMap.delete(event.connId);
    }
  }

  async function send(dest: string, bin: Binary) {
    let conn: MessagePeer.Conn | undefined;
    for (const x of connMap.values()) {
      if (x.remote !== dest) continue;
      if (conn) {
        const p1 = conn.getPriority?.() ?? 0;
        const p2 = x.getPriority?.() ?? 0;
        if (p1 > p2) continue;
      }
      conn = x;
    }

    if (!conn) conn = connMap.get(await connect(dest))!;
    await conn.send(bin);
  }
}
