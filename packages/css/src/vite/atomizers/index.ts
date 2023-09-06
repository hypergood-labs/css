import { borderRadius } from "./border-radius";
import { inset } from "./inset";
import { margin } from "./margin";
import { padding } from "./padding";
import { Atomizer } from "./types";

export const atomizers: Record<string, Atomizer> = {
  "border-radius": borderRadius,
  inset: inset,
  margin: margin,
  padding: padding,
};

export type { Atomizer };
