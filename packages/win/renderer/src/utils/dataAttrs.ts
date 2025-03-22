import { toKebab } from "@utils/namingConvert.ts";

export function toDataAttrs(data: {
  [name: string]: string | boolean | undefined;
}): Record<string, string | undefined> {
  return Object.keys(data).reduce((res, k) => {
    if (data[k] === false) return res;

    if (data[k] === true) {
      res[`data-${toKebab(k)}`] = "";
    } else {
      res[`data-${toKebab(k)}`] = data[k];
    }
    return res;
  }, {} as any);
}
