import { describe, expect, test } from "vitest";
import { variantClassNames } from "./utils";

describe("utils", () => {
  test("variantClassNames", () => {
    expect(
      variantClassNames({ color: { green: "x0-8" } })({ color: "green" })
    ).toBe("x0-8");

    expect(variantClassNames({ color: { green: "x0-8" } })({})).toBe("");
  });
});
