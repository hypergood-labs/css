import { AST_NODE_TYPES, parse } from "@typescript-eslint/typescript-estree";
import { astWalk, Node } from "../utils/ast";

export function moduleToIIFE(src: string) {
  let replacements = [] as {
    start: number;
    end: number;
    value: string;
  }[];

  const tree = parse(src, {
    range: true,
    jsx: true,
    allowInvalidAST: true,
  });

  function remove(node: Node) {
    replacements.push({
      start: node.range[0],
      end: node.range[1],
      value: "",
    });
  }

  const exports: Array<{ local: string; exported: string }> = [];

  astWalk(tree, {
    enter(node) {
      if (node.type === AST_NODE_TYPES.ImportDeclaration) {
        remove(node);
        this.skip();
        return;
      }
      if (node.type === AST_NODE_TYPES.ExportAllDeclaration) {
        remove(node);
        this.skip();
        return;
      }
      if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
        remove(node);
        this.skip();
        return;
      }
      if (node.type === AST_NODE_TYPES.ExportNamedDeclaration) {
        if (node.declaration) {
          replacements.push({
            start: node.range[0],
            end: node.range[0] + "export ".length,
            value: "",
          });
          const declaration = node.declaration;
          if (declaration.type === AST_NODE_TYPES.VariableDeclaration) {
            for (let declarator of declaration.declarations) {
              if (declarator.id.type === AST_NODE_TYPES.Identifier) {
                exports.push({
                  local: declarator.id.name,
                  exported: declarator.id.name,
                });
              }
            }
          } else {
            let identifier = declaration.id;
            if (identifier && identifier.type === AST_NODE_TYPES.Identifier) {
              exports.push({
                local: identifier.name,
                exported: identifier.name,
              });
            }
          }
          return;
        } else {
          remove(node);
          for (let specifier of node.specifiers) {
            if (specifier.type === AST_NODE_TYPES.ExportSpecifier) {
              exports.push({
                local: specifier.local.name,
                exported: specifier.exported.name,
              });
            }
          }

          this.skip();
          return;
        }
      }
    },
  });

  replacements.sort((a, b) => b.start - a.start);

  for (let replacement of replacements) {
    src =
      src.slice(0, replacement.start) +
      replacement.value +
      src.slice(replacement.end);
  }

  function createReturnStatement() {
    let ret = "return {\n";
    for (let exp of exports) {
      ret += `  ${exp.exported}: ${exp.local},\n`;
    }
    ret += "};";
    return ret;
  }

  return `(function () {
${src} 

${createReturnStatement()}
})();`;
}
