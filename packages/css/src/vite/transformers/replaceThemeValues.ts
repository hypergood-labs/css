// @ts-ignore
import { parse } from "@typescript-eslint/typescript-estree";
import type { ImportSpecifier, Node } from "estree";
import * as estreeWalker from "estree-walker";
import { StyleConfig } from "../../types";

export function replaceThemeValues(config: StyleConfig, src: string) {
  let theme = config.theme || {};

  function getSrc(node: Node) {
    return src.slice(node.range![0], node.range![1]);
  }

  let tree = parse(src, {
    range: true,
    jsx: true,
  });

  let modifications = [] as {
    start: number;
    end: number;
    value: string;
  }[];

  let localThemeName = "";

  let getThemeValue = (accessor: string) =>
    Function(
      `const theme = (${JSON.stringify(theme)}); return (${accessor})`
    )();

  estreeWalker.walk(tree, {
    enter(node, parent) {
      if (node.type === "ImportDeclaration") {
        if (node.source.value === "@hypergood/css") {
          let specifier = node.specifiers.find(
            (s) => s.type === "ImportSpecifier" && s.imported.name === "theme"
          ) as ImportSpecifier | undefined;
          if (specifier) {
            localThemeName = specifier.local.name;

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

      if (node.type === "MemberExpression") {
        if (!localThemeName) return;
        let rootObject = node.object;
        while (rootObject.type === "MemberExpression") {
          rootObject = rootObject.object;
        }
        if (rootObject.type === "Identifier") {
          if (rootObject.name === localThemeName) {
            let accessor = getSrc(node);
            let themeValue = getThemeValue(accessor);

            if (themeValue) {
              modifications.push({
                start: node.range![0],
                end: node.range![1],
                value: JSON.stringify(themeValue),
              });
            }
            this.skip();
          }
        }
      }
    },
  });

  modifications.sort((a, b) => b.start - a.start);

  for (let modification of modifications) {
    src =
      src.slice(0, modification.start) +
      modification.value +
      src.slice(modification.end);
  }

  src = src.replaceAll(/import\s+{\s*}\s+from\s+"@hypergood\/css";?\n?/g, "");

  return src;
}
