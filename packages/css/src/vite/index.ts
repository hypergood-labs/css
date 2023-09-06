import type { Plugin } from "vite";
// @ts-ignore
import { parse } from "@typescript-eslint/typescript-estree";
import type { ImportSpecifier, Node } from "estree";
import * as estreeWalker from "estree-walker";
import { Declaration } from "./types";
import { StyleConfig } from "../types";
import {
  declarationToClassName,
  resetDeclarationCache,
} from "./utils/declarationToClassName";
import { declarationsToCSS } from "./utils/declarationsToCSS";
import { cssObjectToDeclarations } from "./utils/cssObjectToDeclarations";
import { mergeClassNames } from "../internals";
import {
  getAttributeFromJSXElement,
  getCSSValueFromJSXElement,
  getSpreadValueFromJSXElement,
} from "./utils/estree";
import { replaceThemeValues } from "./transformers/replaceThemeValues";

type PluginConfig = {
  fileMatch?: RegExp;
  config?: StyleConfig;
};

const virtualModuleId = "virtual:@hypergood/css";
let generatedCssFiles: {
  [filename: string]: string;
} = {};

export default function vitePluginHypergood(config: PluginConfig = {}): Plugin {
  const fileMatch = config.fileMatch ?? /\.(tsx|jsx)$/;
  generatedCssFiles = {};
  resetDeclarationCache();

  function createUniqueFilename(id: string) {
    let baseFilename = id;
    if (id.includes("/src/"))
      baseFilename = id.slice(id.lastIndexOf("/src/") + 5);

    baseFilename = baseFilename.slice(0, baseFilename.lastIndexOf("."));
    let cnt = 1;
    let filename = `${baseFilename}.css`;
    while (generatedCssFiles[filename]) {
      cnt++;
      filename = `${baseFilename}-${cnt}.css`;
    }
    return filename;
  }

  return {
    name: "hypergood-css",
    enforce: "pre",
    buildStart() {
      generatedCssFiles = {};
      resetDeclarationCache();
    },
    resolveId(id) {
      if (!id.startsWith(virtualModuleId)) return undefined;
      return "\0" + id;
    },
    load(id) {
      if (!id.startsWith(`\0${virtualModuleId}`)) return undefined;

      const filename = id
        .slice(`\0${virtualModuleId}`.length + 1)
        .replace(/\?used$/, "");
      return generatedCssFiles[filename];
    },
    async transform(src, id) {
      if (!fileMatch.test(id)) return undefined;

      let filename = createUniqueFilename(id);

      let { code, css } = await transform(src, filename, config.config);

      if (css) {
        generatedCssFiles[filename] = css;
      }

      return {
        code: code!,
        map: null,
      };
    },
  };
}

function getJSXElementAttributeValue(
  src: string,
  jsxOpeningElement: any,
  name: string
) {
  let attribute = jsxOpeningElement.attributes.find(
    (a: any) => a.name?.name === name
  );
  if (!attribute) return undefined;
  let attributeValue = attribute?.value;
  if (!attributeValue) return undefined;
  let type = attributeValue.type;

  if (attributeValue.type === "JSXExpressionContainer") {
    attributeValue = attributeValue.expression;
    type = attributeValue.type;
  }

  let value = attributeValue?.range
    ? src.slice(attributeValue.range[0], attributeValue.range[1])
    : "";
  return { type, value };
}

async function transform(
  src: string,
  filename: string,
  config: StyleConfig = {}
) {
  src = replaceThemeValues(config, src);
  let declarations = [] as Declaration[];

  let tree = parse(src, {
    range: true,
    jsx: true,
  });

  let modifications = [] as {
    start: number;
    end: number;
    value: string;
  }[];

  let imports = {
    mergeClassNames: false,
    createStyledComponent: false,
  };

  function importMergeClassNames() {
    if (imports.mergeClassNames) return;
    modifications.push({
      start: 0,
      end: 0,
      value: `import { mergeClassNames as _$mergeClassNames } from "@hypergood/css/internals";\n`,
    });
    imports.mergeClassNames = true;
  }
  function importCreateStyledComponent() {
    if (imports.createStyledComponent) return;
    modifications.push({
      start: 0,
      end: 0,
      value: `import { createStyledComponent as _$createStyledComponent } from "@hypergood/css/internals";\n`,
    });
    imports.createStyledComponent = true;
  }

  function getSrc(node: Node) {
    return src.slice(node.range![0], node.range![1]);
  }

  function processCSSObjectAndGetClassNames(cssObj: any) {
    let declarationsForThisMatch = cssObjectToDeclarations(config, cssObj);

    declarations.push(...declarationsForThisMatch);

    let classNames = mergeClassNames(
      declarationsForThisMatch.map(declarationToClassName).join(" ")
    );

    return classNames;
  }

  function processCSSObjStringAndGetClassNames(cssObjStr: string) {
    let cssObj = Function(`return (${cssObjStr})`)();

    return processCSSObjectAndGetClassNames(cssObj);
  }

  let localCssImportName = "";
  let localStyledImportName = "";

  estreeWalker.walk(tree, {
    enter(node) {
      if (node.type === "ImportDeclaration") {
        if (node.source.value === "@hypergood/css") {
          let specifier = node.specifiers.find(
            (s) => s.type === "ImportSpecifier" && s.imported.name === "css"
          ) as ImportSpecifier | undefined;
          if (specifier) {
            localCssImportName = specifier.local.name;

            const hasComma = src[specifier.local.range![1]] === ",";

            modifications.push({
              start: specifier.local.range![0],
              end: specifier.local.range![1] + (hasComma ? 1 : 0),
              value: "",
            });
          }
          specifier = node.specifiers.find(
            (s) => s.type === "ImportSpecifier" && s.imported.name === "styled"
          ) as ImportSpecifier | undefined;
          if (specifier) {
            localStyledImportName = specifier.local.name;

            const hasComma = src[specifier.local.range![1]] === ",";

            modifications.push({
              start: specifier.local.range![0],
              end: specifier.local.range![1] + (hasComma ? 1 : 0),
              value: "",
            });
          }
        }
        return;
      }

      if (
        localCssImportName &&
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === localCssImportName
      ) {
        let callExpression = node;
        if (
          callExpression.arguments.length === 1 &&
          callExpression.arguments[0].type === "ObjectExpression"
        ) {
          let cssObj = getSrc(callExpression.arguments[0]);
          let classNames = processCSSObjStringAndGetClassNames(cssObj);

          modifications.push({
            start: callExpression.range![0],
            end: callExpression.range![1],
            value: '"' + classNames + '"',
          });
        } else {
          modifications.push({
            start: callExpression.range![0],
            end: callExpression.range![1],
            value: '""',
          });
        }
      }

      if (
        localStyledImportName &&
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === localStyledImportName
      ) {
        let callExpression = node;
        importCreateStyledComponent();

        let args = callExpression.arguments;
        let tag = args[0];
        let cssObj = args[1];

        let tagStr = '"div"';
        let baseClassNameStr = '""';
        let variantsStr = "{}";
        let compoundVariantsStr = "[]";

        if (tag.type !== "Literal" && tag.type !== "Identifier") {
          modifications.push({
            start: callExpression.range![0],
            end: callExpression.range![1],
            value: `_$createStyledComponent(${tagStr}, ${baseClassNameStr}, ${variantsStr}, ${compoundVariantsStr})`,
          });
          return;
        }

        if (tag.type === "Literal") {
          tagStr = tag.raw!;
        }
        if (tag.type === "Identifier") {
          tagStr = tag.name;
        }

        if (cssObj.type === "ObjectExpression") {
          let config = Function(`return (${getSrc(cssObj)})`)();

          let {
            variants = {},
            defaultVariants = {},
            compoundVariants = [],
            ...base
          } = config;

          let baseClassNames = processCSSObjectAndGetClassNames(base);

          for (let variantName in variants) {
            for (let variantValue in variants[variantName]) {
              variants[variantName][variantValue] =
                processCSSObjectAndGetClassNames(
                  variants[variantName][variantValue]
                );
            }
          }

          variantsStr = JSON.stringify(variants);

          for (let compoundVariantObj of compoundVariants) {
            compoundVariantObj.css = processCSSObjectAndGetClassNames(
              compoundVariantObj.css || {}
            );
            for (let variantName in compoundVariantObj) {
              if (variantName === "css") continue;
              if (typeof compoundVariantObj[variantName] !== "string") {
                compoundVariantObj[variantName] =
                  compoundVariantObj[variantName].toString();
              }
            }
          }

          compoundVariantsStr = JSON.stringify(compoundVariants);

          for (let variantName in defaultVariants) {
            let defaultVariantValue = defaultVariants[variantName];
            if (defaultVariantValue) {
              baseClassNames =
                baseClassNames +
                " " +
                variants[variantName][defaultVariantValue];
            }
          }

          baseClassNameStr = `"${baseClassNames}"`;

          modifications.push({
            start: callExpression.range![0],
            end: callExpression.range![1],
            value: `_$createStyledComponent(${tagStr}, ${baseClassNameStr}, ${variantsStr}, ${compoundVariantsStr})`,
          });
          return;
        } else {
          modifications.push({
            start: callExpression.range![0],
            end: callExpression.range![1],
            value: `_$createStyledComponent(${tagStr}, ${baseClassNameStr}, ${variantsStr}, ${compoundVariantsStr})`,
          });
          return;
        }
      }

      if (node.type === "JSXOpeningElement") {
        let cssValue = getCSSValueFromJSXElement(node);
        if (!cssValue) return this.skip();

        let cssAttribute = getAttributeFromJSXElement(node, "css")!;
        let classNameAttribute = getAttributeFromJSXElement(node, "class");
        if (classNameAttribute) {
          modifications.push({
            start: classNameAttribute.range![0],
            end: classNameAttribute.range![1],
            value: "",
          });
        }
        let originalClassName = getJSXElementAttributeValue(src, node, "class");
        let spreadArgument = getSpreadValueFromJSXElement(node);
        let spreadValue = spreadArgument ? getSrc(spreadArgument) : "";

        let attributeRange = cssAttribute.range;
        let cssExpression = cssValue;

        let classNameGroups: Array<{
          test: string;
          consequent: string;
          alternate: string;
        }> = [];

        let cssExpressionArr =
          cssExpression.type === "ArrayExpression"
            ? cssExpression.elements
            : [cssExpression];

        for (let element of cssExpressionArr) {
          if (!element?.type) continue;
          if (element.type === "ObjectExpression") {
            let section = {
              test: "true",
              consequent: "",
              alternate: "",
            };
            let value = getSrc(element);

            let classNames = processCSSObjStringAndGetClassNames(value);

            section.consequent = classNames;

            classNameGroups.push(section);
          }
          if (element.type === "ConditionalExpression") {
            let section = {
              test: "",
              consequent: "",
              alternate: "",
            };

            let test = getSrc(element.test);
            section.test = test;

            //

            let consequentStr = getSrc(element.consequent);
            let consequentClassNames =
              processCSSObjStringAndGetClassNames(consequentStr);
            section.consequent = consequentClassNames;

            //

            let alternateStr = getSrc(element.alternate);

            let alternateClassNames =
              processCSSObjStringAndGetClassNames(alternateStr);
            section.alternate = alternateClassNames;

            classNameGroups.push(section);
          }
          if (
            element.type === "LogicalExpression" &&
            element.operator == "&&"
          ) {
            let section = {
              test: "",
              consequent: "",
              alternate: "",
            };

            let test = getSrc(element.left);
            section.test = test;

            //

            let consequentStr = getSrc(element.right);
            let consequentClassNames =
              processCSSObjStringAndGetClassNames(consequentStr);
            section.consequent = consequentClassNames;

            classNameGroups.push(section);
          }
        }

        if (
          classNameGroups.length === 1 &&
          classNameGroups[0].test === "true"
        ) {
          modifications.push({
            start: attributeRange![0],
            end: attributeRange![1],
            value: `class="${classNameGroups[0].consequent}"`,
          });
        } else {
          let classNameArguments =
            classNameGroups
              .map((section) =>
                section.test === "true"
                  ? `"${section.consequent}"`
                  : `${section.test} ? "${section.consequent}" : "${section.alternate}"`
              )
              .join(", ") || '""';

          let newClassNameAttribute = `class={_$mergeClassNames(${classNameArguments})}`;

          importMergeClassNames();

          if (originalClassName) {
            newClassNameAttribute = `class={_$mergeClassNames(${originalClassName.value}, ${classNameArguments})}`;
          } else if (spreadValue) {
            newClassNameAttribute = `class={_$mergeClassNames(${spreadValue}.class, ${classNameArguments})}`;
          }

          modifications.push({
            start: attributeRange![0],
            end: attributeRange![1],
            value: newClassNameAttribute,
          });
        }
      }
    },
  });

  if (!declarations.length) return { code: src, css: "" };

  const css = declarationsToCSS(declarations);

  modifications.sort((a, b) => b.start - a.start);

  for (let modification of modifications) {
    src =
      src.slice(0, modification.start) +
      modification.value +
      src.slice(modification.end);
  }

  src = `import "${virtualModuleId}/${filename}"\n` + src;

  src = src.replaceAll(/import\s+{\s*}\s+from\s+"@hypergood\/css";?\n?/g, "");

  return { code: src, css };
}
