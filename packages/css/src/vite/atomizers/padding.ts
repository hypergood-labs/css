import { Atomizer } from "./types";

export const padding: Atomizer = (value) => {
  let paddingParts = value.split(/\s+/);

  let top = "",
    right = "",
    bottom = "",
    left = "";

  switch (paddingParts.length) {
    case 1:
      top = right = bottom = left = paddingParts[0];
      break;
    case 2:
      top = bottom = paddingParts[0];
      right = left = paddingParts[1];
      break;
    case 3:
      top = paddingParts[0];
      right = left = paddingParts[1];
      bottom = paddingParts[2];
      break;
    case 4:
      top = paddingParts[0];
      right = paddingParts[1];
      bottom = paddingParts[2];
      left = paddingParts[3];
      break;
    default:
      return { padding: value };
  }

  return {
    "padding-top": top,
    "padding-right": right,
    "padding-bottom": bottom,
    "padding-left": left,
  };
};
