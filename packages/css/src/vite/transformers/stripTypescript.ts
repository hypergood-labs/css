import { parse, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, astWalk } from "../utils/ast";

const JUST_RIP_THEM_OUT_LOL = [
  AST_NODE_TYPES.TSAbstractAccessorProperty,
  AST_NODE_TYPES.TSAbstractKeyword,
  AST_NODE_TYPES.TSAbstractMethodDefinition,
  AST_NODE_TYPES.TSAbstractPropertyDefinition,
  AST_NODE_TYPES.TSAnyKeyword,
  AST_NODE_TYPES.TSArrayType,
  AST_NODE_TYPES.TSAsExpression,
  AST_NODE_TYPES.TSAsyncKeyword,
  AST_NODE_TYPES.TSBigIntKeyword,
  AST_NODE_TYPES.TSBooleanKeyword,
  AST_NODE_TYPES.TSCallSignatureDeclaration,
  AST_NODE_TYPES.TSClassImplements,
  AST_NODE_TYPES.TSConditionalType,
  AST_NODE_TYPES.TSConstructSignatureDeclaration,
  AST_NODE_TYPES.TSConstructorType,
  AST_NODE_TYPES.TSDeclareFunction,
  AST_NODE_TYPES.TSDeclareKeyword,
  AST_NODE_TYPES.TSEmptyBodyFunctionExpression,
  AST_NODE_TYPES.TSEnumDeclaration,
  AST_NODE_TYPES.TSEnumMember,
  AST_NODE_TYPES.TSExportAssignment,
  AST_NODE_TYPES.TSExportKeyword,
  AST_NODE_TYPES.TSExternalModuleReference,
  AST_NODE_TYPES.TSFunctionType,
  AST_NODE_TYPES.TSImportEqualsDeclaration,
  AST_NODE_TYPES.TSImportType,
  AST_NODE_TYPES.TSIndexSignature,
  AST_NODE_TYPES.TSIndexedAccessType,
  AST_NODE_TYPES.TSInferType,
  AST_NODE_TYPES.TSInstantiationExpression,
  AST_NODE_TYPES.TSInterfaceBody,
  AST_NODE_TYPES.TSInterfaceDeclaration,
  AST_NODE_TYPES.TSInterfaceHeritage,
  AST_NODE_TYPES.TSIntersectionType,
  AST_NODE_TYPES.TSIntrinsicKeyword,
  AST_NODE_TYPES.TSLiteralType,
  AST_NODE_TYPES.TSMappedType,
  AST_NODE_TYPES.TSMethodSignature,
  AST_NODE_TYPES.TSModuleBlock,
  AST_NODE_TYPES.TSModuleDeclaration,
  AST_NODE_TYPES.TSNamedTupleMember,
  AST_NODE_TYPES.TSNamespaceExportDeclaration,
  AST_NODE_TYPES.TSNeverKeyword,
  AST_NODE_TYPES.TSNonNullExpression,
  AST_NODE_TYPES.TSNullKeyword,
  AST_NODE_TYPES.TSNumberKeyword,
  AST_NODE_TYPES.TSObjectKeyword,
  AST_NODE_TYPES.TSOptionalType,
  AST_NODE_TYPES.TSParameterProperty,
  AST_NODE_TYPES.TSPrivateKeyword,
  AST_NODE_TYPES.TSPropertySignature,
  AST_NODE_TYPES.TSProtectedKeyword,
  AST_NODE_TYPES.TSPublicKeyword,
  AST_NODE_TYPES.TSQualifiedName,
  AST_NODE_TYPES.TSReadonlyKeyword,
  AST_NODE_TYPES.TSRestType,
  AST_NODE_TYPES.TSTemplateLiteralType,
  AST_NODE_TYPES.TSThisType,
  AST_NODE_TYPES.TSTupleType,
  AST_NODE_TYPES.TSTypeAliasDeclaration,
  AST_NODE_TYPES.TSTypeAnnotation,
  AST_NODE_TYPES.TSTypeAssertion,
  AST_NODE_TYPES.TSTypeLiteral,
  AST_NODE_TYPES.TSTypeOperator,
  AST_NODE_TYPES.TSTypeParameter,
  AST_NODE_TYPES.TSTypeParameterDeclaration,
  AST_NODE_TYPES.TSTypeParameterInstantiation,
  AST_NODE_TYPES.TSTypePredicate,
  AST_NODE_TYPES.TSTypeQuery,
  AST_NODE_TYPES.TSTypeReference,
  AST_NODE_TYPES.TSUndefinedKeyword,
  AST_NODE_TYPES.TSUnionType,
  AST_NODE_TYPES.TSUnknownKeyword,
  AST_NODE_TYPES.TSVoidKeyword,
];

export function stripTypescript(src: string) {
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

  astWalk(tree, {
    enter(node) {
      if (node.type === AST_NODE_TYPES.TSParameterProperty) {
        if (node.accessibility) {
          replacements.push({
            start: node.range[0],
            end: node.range[0] + node.accessibility.length + 1,
            value: "",
          });
          return;
        }
      }
      if (node.type === AST_NODE_TYPES.ClassDeclaration) {
        if (node.abstract) {
          replacements.push({
            start: node.range[0],
            end: node.range[0] + "abstract".length + 1,
            value: "",
          });
          return;
        }
      }
      if (JUST_RIP_THEM_OUT_LOL.includes(node.type)) {
        remove(node);
        this.skip();
        return;
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

  return src;
}
