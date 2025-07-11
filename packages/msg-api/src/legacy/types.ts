// @ts-ignore
export type JSONValue =
  | undefined
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | Record<string, JSONValue>;

export interface Extension<Type extends string, Data extends JSONValue, API> {
  type: Type;
  handleMessage(id: string, type: Type, data: Data): Promise<void>;
  onDestroy(): void;
  api: API;
}
