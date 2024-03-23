import { test, describe, expect } from "vitest";
import { StyleConfig } from "../../../types";
import { cssObjectToDeclarations } from "./cssObjectToDeclarations";

const CONFIG: StyleConfig = {
  media: {
    sm: "(min-width: 600px)",
  },
};

const convert = (value: any) => cssObjectToDeclarations(CONFIG, value);

describe("cssObjectToDeclarations", () => {
  test("simple declaration", () => {
    expect(convert({ color: "red" })).toStrictEqual([
      { atRules: [], selector: "&", property: "color", value: "red" },
    ]);
  });

  test("kebab case", () => {
    expect(convert({ backgroundColor: "red" })).toStrictEqual([
      {
        atRules: [],
        selector: "&",
        property: "background-color",
        value: "red",
      },
    ]);
  });

  test("pseudo classes", () => {
    expect(convert({ ":hover": { color: "red" } })).toStrictEqual([
      {
        atRules: [],
        selector: "&:hover",
        property: "color",
        value: "red",
      },
    ]);
  });

  test("pseudo elements", () => {
    expect(convert({ "::before": { color: "red" } })).toStrictEqual([
      {
        atRules: [],
        selector: "&::before",
        property: "color",
        value: "red",
      },
    ]);
  });

  test("attribute selector", () => {
    expect(convert({ "[disabled]": { color: "red" } })).toStrictEqual([
      {
        atRules: [],
        selector: "&[disabled]",
        property: "color",
        value: "red",
      },
    ]);
  });

  test("descendant selector", () => {
    expect(convert({ div: { color: "red" } })).toStrictEqual([
      {
        atRules: [],
        selector: "& div",
        property: "color",
        value: "red",
      },
    ]);
  });

  test("child selector", () => {
    expect(convert({ "> div": { color: "red" } })).toStrictEqual([
      {
        atRules: [],
        selector: "& > div",
        property: "color",
        value: "red",
      },
    ]);
  });

  test("multiple selectors", () => {
    expect(convert({ "div, a": { color: "red" } })).toStrictEqual([
      {
        atRules: [],
        selector: "& div",
        property: "color",
        value: "red",
      },
      {
        atRules: [],
        selector: "& a",
        property: "color",
        value: "red",
      },
    ]);
  });

  test("media from config", () => {
    expect(convert({ "@sm": { color: "red" } })).toStrictEqual([
      {
        atRules: ["@media (min-width: 600px)"],
        selector: "&",
        property: "color",
        value: "red",
      },
    ]);
  });

  test("arbitrary media", () => {
    expect(
      convert({ "@media (min-width: 600px)": { color: "red" } })
    ).toStrictEqual([
      {
        atRules: ["@media (min-width: 600px)"],
        selector: "&",
        property: "color",
        value: "red",
      },
    ]);
  });
});
