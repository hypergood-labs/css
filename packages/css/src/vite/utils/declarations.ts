import { Declaration } from "../types";

export function hashDeclaration(declaration: Declaration) {
  return `${declaration.selector};${declaration.property};${
    declaration.value
  };${declaration.atRules.join(";")}`;
}

export function dedupeDeclarations(declarations: Declaration[]) {
  const result: Declaration[] = [];
  const seen = new Set<string>();

  for (const declaration of declarations) {
    const key = hashDeclaration(declaration);
    if (!seen.has(key)) {
      result.push(declaration);
      seen.add(key);
    }
  }

  return result;
}
