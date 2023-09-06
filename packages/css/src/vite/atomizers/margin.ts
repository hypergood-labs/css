import { Atomizer } from "./types";

export const margin: Atomizer = (value) => {
  let isImportant = value.endsWith("!important");
  if (isImportant) {
    value = value.slice(0, -10);
  }
  let marginParts = value
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  let top = "",
    right = "",
    bottom = "",
    left = "";

  switch (marginParts.length) {
    case 1:
      top = right = bottom = left = marginParts[0];
      break;
    case 2:
      top = bottom = marginParts[0];
      right = left = marginParts[1];
      break;
    case 3:
      top = marginParts[0];
      right = left = marginParts[1];
      bottom = marginParts[2];
      break;
    case 4:
      top = marginParts[0];
      right = marginParts[1];
      bottom = marginParts[2];
      left = marginParts[3];
      break;
    default:
      return { margin: value };
  }

  if (isImportant) {
    top += " !important";
    right += " !important";
    bottom += " !important";
    left += " !important";
  }

  return {
    "margin-top": top,
    "margin-right": right,
    "margin-bottom": bottom,
    "margin-left": left,
  };
};
