import { StyleConfig } from "../../types";
import { Declaration } from "../types";
import { atomizers } from "../atomizers";
import { toKebabCase } from "./string";

export function cssObjectToDeclarations(
  config: StyleConfig = {},
  cssObj: Record<string, any>
) {
  cssObj = evaluateUtils(config, cssObj);
  return nestedCssObjectToDeclarations(config, cssObj);
}

function evaluateUtils(config: StyleConfig = {}, cssObj: Record<string, any>) {
  const utils = config.utils ?? {};
  const utilsKeys = Object.keys(utils);
  const utilsValues = Object.values(utils);

  let result = { ...cssObj };

  for (const [key, value] of Object.entries(cssObj)) {
    if (utilsKeys.includes(key)) {
      let resultingCss = (utilsValues[utilsKeys.indexOf(key)](value) ||
        {}) as any;
      resultingCss = evaluateUtils(config, resultingCss);
      result = {
        ...result,
        ...resultingCss,
      };
      delete result[key];
    }
  }

  return result;
}

function nestedCssObjectToDeclarations(
  config: StyleConfig = {},
  cssObj: Record<string, any>,
  selector = "&",
  atRules: string[] = []
): Declaration[] {
  return Object.entries(cssObj).flatMap(([key, value]) => {
    if (typeof value === "object") {
      if (key.startsWith("@")) {
        let newAtRule = key;
        let media = config.media ?? {};
        if (media[key.slice(1)]) {
          newAtRule = `@media ${media[key.slice(1)]}`;
        }
        return nestedCssObjectToDeclarations(config, value, selector, [
          newAtRule,
          ...atRules,
        ]);
      }
      let nextSelector = key;

      if (!nextSelector.includes("&")) {
        if (nextSelector.startsWith(":")) {
          nextSelector = `&${nextSelector}`;
        } else {
          nextSelector = `& ${nextSelector}`;
        }
      }
      nextSelector = nextSelector.replaceAll("&", selector);

      let nextSelectors = nextSelector.split(/,\s*/);

      return nextSelectors.flatMap((nextSelector) =>
        nestedCssObjectToDeclarations(config, value, nextSelector, atRules)
      );
    }

    key = toKebabCase(key);

    if (typeof value === "number" && !unitlessProps[key]) {
      value = value + "px";
    }

    if (key in atomizers) {
      return Object.entries(atomizers[key](value)).map(([key, value]) => {
        return {
          selector,
          property: key,
          value: value || "",
          atRules,
        };
      });
    }

    return [
      {
        selector,
        property: key,
        value: value.toString(),
        atRules,
      },
    ];
  });
}

/** CSS Properties whose number values should be unitless. */
export const unitlessProps: Record<string, number> = {
  "animation-iteration-count": 1,
  "border-image-outset": 1,
  "border-image-slice": 1,
  "border-Image-width": 1,
  "box-flex": 1,
  "box-flex-group": 1,
  "box-ordinal-group": 1,
  "column-count": 1,
  columns: 1,
  flex: 1,
  "flex-grow": 1,
  "flex-positive": 1,
  "flex-shrink": 1,
  "flex-negative": 1,
  "flex-order": 1,
  "grid-row": 1,
  "grid-row-end": 1,
  "grid-row-span": 1,
  "grid-row-start": 1,
  "grid-column": 1,
  "grid-column-end": 1,
  "grid-column-span": 1,
  "grid-column-start": 1,
  "ms-grid-row": 1,
  "ms-grid-row-span": 1,
  "ms-grid-column": 1,
  "ms-grid-column-span": 1,
  "font-weight": 1,
  "line-height": 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  "tab-size": 1,
  widows: 1,
  "z-index": 1,
  zoom: 1,
  "-webkit-line-clamp": 1,

  // SVG-related properties
  "fill-opacity": 1,
  "flood-opacity": 1,
  "stop-opacity": 1,
  "stroke-dasharray": 1,
  "stroke-dashoffset": 1,
  "stroke-miterlimit": 1,
  "stroke-opacity": 1,
  "stroke-width": 1,
};
