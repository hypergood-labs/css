import { StyleConfig } from "../../../types";

export function evaluateUtils(
  config: StyleConfig = {},
  cssObj: Record<string, any>,
  lastUtil?: string
) {
  const utils = config.utils ?? {};

  let result: any = {};

  for (const [key, value] of Object.entries(cssObj)) {
    const util = utils[key] as ((value: any) => any) | undefined;

    // Evaluate util
    if (util) {
      // Prevent infinite recursion
      if (key !== lastUtil) {
        const utilResult = util(value);
        if (typeof utilResult === "object") {
          // evaluate nested utils
          result = {
            ...result,
            ...evaluateUtils(config, utilResult, key),
          };
        } else {
          result[key] = utilResult;
        }
      } else {
        result[key] = value;
      }
      continue;
    }

    // Evaluate nested objects
    if (typeof value === "object") {
      result[key] = evaluateUtils(config, value, lastUtil);
      continue;
    }

    result[key] = value;
  }

  return result;
}
