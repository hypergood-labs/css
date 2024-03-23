import { TSESTree } from "@typescript-eslint/typescript-estree";

export function getValueFromJSXElement(
  node: TSESTree.JSXOpeningElement,
  attributeName: string
): TSESTree.Literal | TSESTree.Expression | undefined {
  let attr = node.attributes.find((attr) => {
    if (attr.type !== "JSXAttribute") return false;
    if (attr.name.name !== attributeName) return false;
    return true;
  }) as TSESTree.JSXAttribute | undefined;
  if (!attr) return undefined;
  let value = attr.value;
  if (!value) return undefined;
  if (value.type === "Literal") {
    return value;
  }
  if (value.type === "JSXExpressionContainer") {
    let expression = value.expression;
    if (expression.type === "JSXEmptyExpression") return undefined;
    return expression;
  }
  return undefined;
}

export function getAttributeFromJSXElement(
  node: TSESTree.JSXOpeningElement,
  attributeName: string
): TSESTree.JSXAttribute | undefined {
  let attr = node.attributes.find((attr) => {
    if (attr.type !== "JSXAttribute") return false;
    if (attr.name.name !== attributeName) return false;
    return true;
  }) as TSESTree.JSXAttribute | undefined;
  return attr;
}

export function getSpreadAttributeFromJSXElement(
  node: TSESTree.JSXOpeningElement
): TSESTree.JSXSpreadAttribute | undefined {
  let attr = node.attributes.find((attr) => {
    if (attr.type !== "JSXSpreadAttribute") return false;
    return true;
  }) as TSESTree.JSXSpreadAttribute | undefined;
  return attr;
}

export function getSpreadValueFromJSXElement(
  node: TSESTree.JSXOpeningElement
): TSESTree.Expression | undefined {
  let attr = getSpreadAttributeFromJSXElement(node);
  if (!attr) return undefined;
  return attr.argument;
}

export function getCSSValueFromJSXElement(node: TSESTree.JSXOpeningElement) {
  let expression = getValueFromJSXElement(node, "css");
  if (!expression) return undefined;
  if (
    expression.type === "ObjectExpression" ||
    expression.type === "ArrayExpression"
  )
    return expression;
  return undefined;
}
