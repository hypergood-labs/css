import { Atomizer } from "./types";

export const inset: Atomizer = (value) => {
  let insetParts = value.split(/\s+/);

  let top = "",
    right = "",
    bottom = "",
    left = "";

  switch (insetParts.length) {
    case 1:
      top = right = bottom = left = insetParts[0];
      break;
    case 2:
      top = bottom = insetParts[0];
      right = left = insetParts[1];
      break;
    case 3:
      top = insetParts[0];
      right = left = insetParts[1];
      bottom = insetParts[2];
      break;
    case 4:
      top = insetParts[0];
      right = insetParts[1];
      bottom = insetParts[2];
      left = insetParts[3];
      break;
    default:
      return { inset: value };
  }

  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left,
  };
};
