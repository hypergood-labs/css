import { expect, test, describe } from "vitest";
import { StyleConfig } from "../types";
import { evaluateUtils } from "../vite/utils/evaluateUtils";

const CONFIG: StyleConfig = {
  media: {
    sm: "(min-width: 600px)",
  },
  utils: {
    bg: (value) => ({
      background: value,
    }),
    fontSize: (value) => ({
      fontSize: typeof value === "number" ? value / 16 + "rem" : value,
    }),
    dark: (value) => ({
      "@media (prefers-color-scheme: dark)": value,
    }),
  },
};

describe("evaluateUtils", () => {
  test("passes through simple object", () => {
    expect(evaluateUtils(CONFIG, { color: "red" })).toEqual({ color: "red" });
  });

  test("passes through nested object", () => {
    expect(
      evaluateUtils(CONFIG, {
        color: "red",
        "@sm": { color: "green" },
        ":hover": { color: "blue" },
      })
    ).toEqual({
      color: "red",
      "@sm": { color: "green" },
      ":hover": { color: "blue" },
    });
  });

  test("evaluates simple util", () => {
    expect(evaluateUtils(CONFIG, { bg: "red" })).toEqual({ background: "red" });
  });

  test("evaluates nested util", () => {
    expect(
      evaluateUtils(CONFIG, { "@sm": { ":hover": { bg: "red" } } })
    ).toEqual({ "@sm": { ":hover": { background: "red" } } });
  });

  test("evaluates recursive util", () => {
    expect(evaluateUtils(CONFIG, { fontSize: 16 })).toEqual({
      fontSize: "1rem",
    });
  });

  test("evaluates utils with css argument", () => {
    expect(
      evaluateUtils(CONFIG, { bg: "white", dark: { bg: "black" } })
    ).toEqual({
      background: "white",
      "@media (prefers-color-scheme: dark)": { background: "black" },
    });
  });
});
