import { Atomizer } from "./types";

export const borderRadius: Atomizer = (value) => {
  let [horizontal, vertical] = value.split("/").map((s) => s.trim());

  if (!vertical) {
    vertical = horizontal;
  }

  let horizontalParts = horizontal.split(/\s+/);
  let rtlh = "",
    rtrh = "",
    rbrh = "",
    rblh = "";
  switch (horizontalParts.length) {
    case 1:
      rtlh = rtrh = rbrh = rblh = horizontalParts[0];
      break;
    case 2:
      rtlh = rbrh = horizontalParts[0];
      rtrh = rblh = horizontalParts[1];
      break;
    case 3:
      rtlh = horizontalParts[0];
      rtrh = rblh = horizontalParts[1];
      rbrh = horizontalParts[2];
      break;
    case 4:
      rtlh = horizontalParts[0];
      rtrh = horizontalParts[1];
      rbrh = horizontalParts[2];
      rblh = horizontalParts[3];
      break;
    default:
      return { "border-radius": value };
  }

  let verticalParts = vertical.split(/\s+/);
  let rtlv = "",
    rtrv = "",
    rbrv = "",
    rblv = "";
  switch (verticalParts.length) {
    case 1:
      rtlv = rtrv = rbrv = rblv = verticalParts[0];
      break;
    case 2:
      rtlv = rbrv = verticalParts[0];
      rtrv = rblv = verticalParts[1];
      break;
    case 3:
      rtlv = verticalParts[0];
      rtrv = rblv = verticalParts[1];
      rbrv = verticalParts[2];
      break;
    case 4:
      rtlv = verticalParts[0];
      rtrv = verticalParts[1];
      rbrv = verticalParts[2];
      rblv = verticalParts[3];
      break;
    default:
      return { "border-radius": value };
  }

  let rtl = rtlh === rtlv ? rtlh : rtlh + " " + rtlv;
  let rtr = rtrh === rtrv ? rtrh : rtrh + " " + rtrv;
  let rbr = rbrh === rbrv ? rbrh : rbrh + " " + rbrv;
  let rbl = rblh === rblv ? rblh : rblh + " " + rblv;

  return {
    "border-top-left-radius": rtl,
    "border-top-right-radius": rtr,
    "border-bottom-right-radius": rbr,
    "border-bottom-left-radius": rbl,
  };
};
