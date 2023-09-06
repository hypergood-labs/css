import { Declaration } from "../types";
import { toBase64ish } from "./string";

let declarationIndex = 1;
let declarationCache: {
  [declarationHash: string]: string;
} = {};

let valueIndex = 1;
let valueCache: {
  [valueHash: string]: string;
} = {};

export function resetDeclarationCache() {
  declarationIndex = 1;
  declarationCache = {};
  valueIndex = 1;
  valueCache = {};
}

export function declarationToClassName(declaration: Declaration): string {
  let { selector, property, value, atRules } = declaration;

  const declarationKey = JSON.stringify([selector, property, ...atRules]);
  let declarationHash = declarationCache[declarationKey];
  if (!declarationHash) {
    declarationCache[declarationKey] = toBase64ish(declarationIndex++);
    declarationHash = declarationCache[declarationKey];
  }

  const valueKey = value;
  let valueHash = valueCache[valueKey];
  if (!valueHash) {
    valueCache[valueKey] = toBase64ish(valueIndex++);
    valueHash = valueCache[valueKey];
  }

  const className = "x" + declarationHash + "-" + valueHash;

  return className;
}
