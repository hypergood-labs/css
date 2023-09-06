import {
  JSXAttribute,
  JSXOpeningElement,
  JSXSpreadAttribute,
} from "../../estree-ts-jsx";
import { Literal, Expression } from "estree";

export function getValueFromJSXElement(
  node: JSXOpeningElement,
  attributeName: string
): Literal | Expression | undefined {
  let attr = node.attributes.find((attr) => {
    if (attr.type !== "JSXAttribute") return false;
    if (attr.name.name !== attributeName) return false;
    return true;
  }) as JSXAttribute | undefined;
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
  node: JSXOpeningElement,
  attributeName: string
): JSXAttribute | undefined {
  let attr = node.attributes.find((attr) => {
    if (attr.type !== "JSXAttribute") return false;
    if (attr.name.name !== attributeName) return false;
    return true;
  }) as JSXAttribute | undefined;
  return attr;
}

export function getSpreadAttributeFromJSXElement(
  node: JSXOpeningElement
): JSXSpreadAttribute | undefined {
  let attr = node.attributes.find((attr) => {
    if (attr.type !== "JSXSpreadAttribute") return false;
    return true;
  }) as JSXSpreadAttribute | undefined;
  return attr;
}

export function getSpreadValueFromJSXElement(
  node: JSXOpeningElement
): Expression | undefined {
  let attr = getSpreadAttributeFromJSXElement(node);
  if (!attr) return undefined;
  return attr.argument;
}

export function getCSSValueFromJSXElement(node: JSXOpeningElement) {
  let expression = getValueFromJSXElement(node, "css");
  if (!expression) return undefined;
  if (
    expression.type === "ObjectExpression" ||
    expression.type === "ArrayExpression"
  )
    return expression;
  return undefined;
}
