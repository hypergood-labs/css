import { Declaration } from "../types";
import { declarationToClassName } from "./declarationToClassName";
import { dedupeDeclarations } from "./declarations";

export function declarationsToCSS(
  declarations: Declaration[],
  indent = 0
): string {
  let declarationsWithAtRules: Record<string, Declaration[]> = {};
  let result = "";
  declarations = dedupeDeclarations(declarations);

  for (const declaration of declarations) {
    let { selector, property, value, atRules } = declaration;
    if (atRules.length > indent) {
      let atRule = atRules[indent];
      if (!declarationsWithAtRules[atRule]) {
        declarationsWithAtRules[atRule] = [];
      }
      declarationsWithAtRules[atRule].push(declaration);
    } else {
      selector = selector.replaceAll(
        "&",
        `.${declarationToClassName(declaration)}`
      );
      result += `${" ".repeat(indent)}${selector} { ${property}: ${value}; }\n`;
    }
  }

  for (const [atRule, declarations] of Object.entries(
    declarationsWithAtRules
  )) {
    result += `${atRule} {\n${declarationsToCSS(declarations, indent + 1)}}\n`;
  }

  return result;
}
