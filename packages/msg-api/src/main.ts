import {
  createMessagePeer,
  type MessagePeer,
} from "./core/createMessagePeer.ts";
import { createMessageAPI } from "./core/createMessageAPI.ts";

const peer = await createMessagePeer({
  identifier: "mainProcess",
  async connect(dest, callback) {
    const conn: MessagePeer.Conn = {
      id: `mainProcess2${dest}`,
      remote: dest,
      disconnect: () => Promise.resolve(),
      async send(bin) {
        // const wc = webContents.fromId(dest);
        // wc.send(`message-api::message`, bin);
      },
    };

    // ipcMain.on(`message-api::message`, async (_, bin) => {
    //   await callback({ type: "data", data: bin });
    // });

    // const wc = webContents.fromId(dest);
    // wc.on("close", async () => {
    //   await callback({ type: "disconnect", connId: conn.id });
    // });

    await callback({ type: "connect", conn });
    return conn;
  },
  async handleData(origin, data) {
    // ...
  },
});
const api = await createMessageAPI({
  identifier: "mainProcess",
  async handleData(origin, data) {
    // ...
  },
});
