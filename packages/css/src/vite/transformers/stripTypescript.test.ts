import { describe, expect, it } from "vitest";
import { stripTypescript } from "./stripTypescript";

function collapseWhitespace(str: string) {
  return str.replace(/\s+/g, " ").trim();
}

function check(from: string, to: string) {
  expect(collapseWhitespace(stripTypescript(from))).toBe(
    collapseWhitespace(to)
  );
}

// i be yoinking a bunch of tests from https://github.com/microsoft/TypeScript/tree/main/tests/cases/compiler
describe("stripTypescript", () => {
  it("2dArrays", () => {
    check(
      `class Cell {
}

class Ship {
    isSunk: boolean;
}

class Board {
    ships: Ship[];
    cells: Cell[];

    private allShipsSunk() {
        return this.ships.every(function (val) { return val.isSunk; });
    }    
}`,
      `class Cell {
}

class Ship {
    isSunk;
}

class Board {
    ships;
    cells;

    private allShipsSunk() {
        return this.ships.every(function (val) { return val.isSunk; });
    }    
}`
    );
  });

  it("ArrowFunctionExpression", () => {
    check(`var v = (public x: string) => { };`, `var v = (x) => { };`);
  });

  it("FunctionDeclaration", () => {
    check(`function foo();`, ``);
    check(
      `function foo();
function bar() { }`,
      `function bar() { }`
    );
    check(
      `{
  function foo();
  function bar() { }
}`,
      `{
  function bar() { }
}`
    );
  });

  it("ParameterList", () => {
    check(
      `function F(public A) {
    }`,
      `function F(A) {
      }`
    );
    check(
      `function A(): (public B) => C {
      }`,
      `function A() {
      }`
    );
    check(
      `class C {
        constructor(C: (public A) => any) {
        }
      }`,
      `class C {
        constructor(C) {
        }
      }`
    );
    check(
      `class C1 {
        constructor(public p3:any) {} // OK
       }`,
      `class C1 {
        constructor(p3) {} // OK
       }`
    );
    check(
      `interface I {
        new (public x);
    }`,
      ``
    );
  });

  it("abstractClassInLocalScope", () => {
    check(
      `(() => {
      abstract class A {}
      class B extends A {}
      new B();
      return A;
  })();`,
      `(() => {
        class A {}
        class B extends A {}
        new B();
        return A;
    })();`
    );
  });
});
