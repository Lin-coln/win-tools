import type { ReturnAPI } from "./return.ts";

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
    origin: string;
    dest: string;
    id: string;
    data: Data;
  };

  export type RawData = {
    $origin: string;
    $dest: string;
    $id: string;
    $type: string;
    $data: any;
  };

  export interface Context {
    identifier: string;
    uuid(): string;
    send(data: RawData): Promise<void>;
    return: ReturnAPI["postReturn"];
    await: ReturnAPI["promiseReturn"];
  }
}
