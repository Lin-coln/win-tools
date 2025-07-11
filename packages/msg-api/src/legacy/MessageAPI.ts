import type { Extension, JSONValue } from "./types.ts";
import { createInvokeExtension, type InvokeAPI } from "./ext-invoke.ts";
import { createReturnExtension, type ReturnAPI } from "./ext-return.ts";
import { createEmitExtension, type EmitAPI } from "./ext-emit.ts";

export abstract class MessageAPI implements ReturnAPI {
  #extMap: Map<string, Extension<string, any, any>>;

  protected constructor() {
    this.#extMap = new Map();
    const $return = createReturnExtension(this);
    const $invoke = createInvokeExtension(this);
    const $emit = createEmitExtension(this);
    this.#extMap.set($return.type, $return);
    this.#extMap.set($invoke.type, $invoke);
    this.#extMap.set($emit.type, $emit);
  }

  public abstract uuid(): string;

  public abstract postMessage(msg: JSONValue): void;

  #getAPI<T>(type: string): T {
    const ext = this.#extMap.get(type);
    if (!ext) throw new Error(`Ext(${type}) not found`);
    return ext.api as T;
  }

  get promiseReturn() {
    return this.#getAPI<ReturnAPI>("return").promiseReturn;
  }
  get postReturn() {
    return this.#getAPI<ReturnAPI>("return").postReturn;
  }

  protected async handleMessage(msg: JSONValue) {
    if (!msg.$type) {
      console.warn(`unhandled message`, msg);
      return;
    }

    const ext = this.#extMap.get(msg.$type);
    if (!ext) {
      console.warn(`unhandled message (${msg.$type})`, msg);
      return;
    }
    await ext.handleMessage(msg.$id, msg.$type, msg.$data);
  }

  protected destroy() {
    this.#extMap.forEach((ext) => ext.onDestroy());
    this.#extMap.clear();
  }

  public export(): InvokeAPI & EmitAPI {
    return {
      ...this.#getAPI<InvokeAPI>("invoke"),
      ...this.#getAPI<EmitAPI>("emit"),
    };
  }
}
