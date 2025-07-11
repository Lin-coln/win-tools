import type { ReturnAPI } from "../protocols/return.ts";

export type Binary = Uint8Array;

export interface Protocol<
  Name extends string = string,
  Data extends any = any,
  API extends any = any,
> {
  name: Name;
  api: API;
  destroy(): void;
  handleMessage(event: Protocol.MessageEvent<Data>): Promise<void>;
}

export namespace Protocol {
  export type MessageEvent<Data> = {
    sender: string;
    receiver: string;
    id: string;
    data: Data;
  };

  export type RawData = {
    $sender: string;
    $receiver: string;
    $id: string;
    $type: string;
    $data: any;
  };

  export interface Context {
    identifier: string;
    uuid(): string;
    postMessage(data: RawData): Promise<void>;
    return: ReturnAPI["postReturn"];
    await: ReturnAPI["promiseReturn"];
  }
}
