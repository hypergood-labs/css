import { resolve } from "path";
import { env } from "process";
import type { Options } from "tsup";

const isProd = env.NODE_ENV === "production";

export const tsup: Options = {
  clean: true,
  dts: true,
  entry: [resolve(__dirname, "src", "index.ts")],
  minify: false,
  sourcemap: true,
  splitting: false,
  format: ["cjs", "esm"],
  target: "node18",
};
