import { Declaration } from "../types";
import { toBase64ish } from "./string";

let propertyCacheIndex = 1;
let propertyCache: {
  [declarationHash: string]: string;
} = {};

let valueCacheIndex = 1;
let valueCache: {
  [valueHash: string]: string;
} = {};

export function resetDeclarationCache() {
  propertyCacheIndex = 1;
  propertyCache = {};
  valueCacheIndex = 1;
  valueCache = {};
}

export function declarationToClassName(declaration: Declaration): string {
  let { selector, property, value, atRules } = declaration;

  const declarationKey = [selector, property, ...atRules].join(" $ ");
  let declarationHash = propertyCache[declarationKey];
  if (!declarationHash) {
    propertyCache[declarationKey] = toBase64ish(propertyCacheIndex++);
    declarationHash = propertyCache[declarationKey];
  }

  const valueKey = value;
  let valueHash = valueCache[valueKey];
  if (!valueHash) {
    valueCache[valueKey] = toBase64ish(valueCacheIndex++);
    valueHash = valueCache[valueKey];
  }

  const className = "x" + declarationHash + "-" + valueHash;

  return className;
}

export function getDeclarationCache() {
  return {
    propertyCache,
    valueCache,
  };
}

export function setDeclarationCache(
  cache: ReturnType<typeof getDeclarationCache>
) {
  propertyCache = cache.propertyCache;
  propertyCacheIndex = Object.keys(propertyCache).length + 1;

  valueCache = cache.valueCache;
  valueCacheIndex = Object.keys(valueCache).length + 1;
}
