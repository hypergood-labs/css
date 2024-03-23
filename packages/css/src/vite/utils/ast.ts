import {
  parse,
  TSESTree,
  AST_NODE_TYPES,
} from "@typescript-eslint/typescript-estree";
import * as estreeWalker from "estree-walker";

export type Node = TSESTree.Node;
type WalkerContext = {
  skip: () => void;
  remove: () => void;
  replace: (node: Node) => void;
};
type SyncHandler = (
  this: WalkerContext,
  node: Node,
  parent: Node | null,
  key: string | number | symbol | null | undefined,
  index: number | null | undefined
) => void;

type AsyncHandler = (
  this: WalkerContext,
  node: Node,
  parent: Node | null,
  key: string | number | symbol | null | undefined,
  index: number | null | undefined
) => Promise<void>;

export function astWalk(
  ast: Node,
  walker: {
    enter?: SyncHandler;
    leave?: SyncHandler;
  }
): Node | null {
  return estreeWalker.walk(ast as any, walker as any) as any;
}

export function astWalkAsync(
  ast: Node,
  walker: {
    enter?: AsyncHandler;
    leave?: AsyncHandler;
  }
): Node | null {
  return estreeWalker.asyncWalk(ast as any, walker as any) as any;
}
