import { describe, expect, it } from "vitest";
import { moduleToIIFE } from "./moduleToIIFE";

function collapseWhitespace(str: string) {
  // return str.trim();
  return str.replace(/\s+/g, " ").trim();
}

function check(from: string, to: string) {
  expect(collapseWhitespace(moduleToIIFE(from))).toBe(collapseWhitespace(to));
}

describe("moduleToIIFE", () => {
  it("works", () => {
    let src: string, expected: string;

    src = `export let name1, name2;
export const name3 = 1, name4 = 2;
export function functionName() { }
export class ClassName { }
export function* generatorFunctionName() { }`;

    expected = `(function () {
let name1, name2;
const name3 = 1, name4 = 2;
function functionName() { }
class ClassName { }
function* generatorFunctionName() { }

return {
  name1: name1,
  name2: name2,
  name3: name3,
  name4: name4,
  functionName: functionName,
  ClassName: ClassName,
  generatorFunctionName: generatorFunctionName,
};
})();`;

    check(src, expected);

    src = `export { variable1 as name1, variable2 as name2, nameN };
export { name3 as default };`;

    expected = `(function () {
return {
  name1: variable1,
  name2: variable2,
  nameN: nameN,
  default: name3,
};
})();`;

    check(src, expected);
  });
});
