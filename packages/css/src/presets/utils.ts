import { CSS } from "../types";

/**
 * Baseline 14px, Major Second Scale font size (1.125x), font size snaps to 1px, line height snaps to 4px.
 */
const fontScales: Record<string, [fontSize: number, lineHeight: number]> = {
  "-3": [10, 16],
  "-2": [11, 16],
  "-1": [12, 16],
  0: [14, 20],
  1: [16, 24],
  2: [18, 28],
  3: [20, 28],
  4: [22, 28],
  5: [25, 32],
  6: [28, 36],
  7: [32, 40],
  8: [36, 44],
  9: [40, 48],
  10: [45, 52],
  11: [51, 60],
  12: [57, 64],
  13: [64, 72],
  14: [72, 80],
  15: [81, 88],
  16: [91, 96],
  17: [103, 104],
};

/**
 * Dynamic letter spacing algorithm, using recommended parameters for Inter.
 *
 * From https://rsms.me/inter/dynmetrics/
 */
function getLetterSpacing(fontSize: number) {
  let a = -0.0223;
  let b = 0.185;
  let c = -0.1745;
  let spacing = a + b * Math.exp(c * fontSize);
  return spacing;
}

// Basic math fns, taken from tailwindcss
const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
export const rem = (px: number) => `${round(px / 16)}rem`;
export const em = (px: number, base: number) => `${round(px / base)}em`;

export const RECOMMENDED_UTILS = {
  //background
  bg: (background: CSS["background"]) => ({
    background,
  }),
  textBG: (bg: CSS["backgroundImage"]) =>
    bg
      ? {
          "-webkit-background-clip": "text",
          backgroundClip: "text",
          color: "transparent",
          backgroundImage: bg,
        }
      : {},

  // border
  b: (border: CSS["border"]) => ({
    border,
  }),
  bt: (borderTop: CSS["borderTop"]) => ({
    borderTop,
  }),
  br: (borderRight: CSS["borderRight"]) => ({
    borderRight,
  }),
  bb: (borderBottom: CSS["borderBottom"]) => ({
    borderBottom,
  }),
  bl: (borderLeft: CSS["borderLeft"]) => ({
    borderLeft,
  }),
  bx: (borderInline: CSS["borderLeft"]) => ({
    borderLeft: borderInline,
    borderRight: borderInline,
  }),
  by: (borderBlock: CSS["borderTop"]) => ({
    borderTop: borderBlock,
    borderRight: borderBlock,
  }),

  // border-radius
  r: (radius: CSS["borderRadius"]) => ({
    borderRadius: radius,
  }),
  rt: (radius: CSS["borderRadius"]) => ({
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
  }),
  rr: (radius: CSS["borderRadius"]) => ({
    borderTopRightRadius: radius,
    borderBottomRightRadius: radius,
  }),
  rb: (radius: CSS["borderRadius"]) => ({
    borderBottomRightRadius: radius,
    borderBottomLeftRadius: radius,
  }),
  rl: (radius: CSS["borderRadius"]) => ({
    borderTopLeftRadius: radius,
    borderBottomLeftRadius: radius,
  }),
  rtl: (radius: CSS["borderRadius"]) => ({
    borderTopLeftRadius: radius,
  }),
  rtr: (radius: CSS["borderRadius"]) => ({
    borderTopRightRadius: radius,
  }),
  rbr: (radius: CSS["borderRadius"]) => ({
    borderBottomRightRadius: radius,
  }),
  rbl: (radius: CSS["borderRadius"]) => ({
    borderBottomLeftRadius: radius,
  }),

  // divide
  divideColor: (offset: CSS["borderColor"]) => ({
    "& > * + *": {
      borderColor: offset,
    },
  }),
  divideStyle: (offset: CSS["borderStyle"]) => ({
    "& > * + *": {
      borderStyle: offset,
    },
  }),
  divideX: (offset: CSS["borderLeft"]) => ({
    "& > * + *": {
      borderLeft: offset,
    },
  }),
  divideXWidth: (offset: CSS["borderLeftWidth"]) => ({
    "& > * + *": {
      borderLeftWidth: offset,
    },
  }),
  divideY: (offset: CSS["borderTop"]) => ({
    "& > * + *": {
      borderTop: offset,
    },
  }),
  divideYWidth: (offset: CSS["borderTopWidth"]) => ({
    "& > * + *": {
      borderTopWidth: offset,
    },
  }),

  // inset
  inset: (inset: CSS["top"]) => ({
    top: inset,
    right: inset,
    bottom: inset,
    left: inset,
  }),
  insetX: (inset: CSS["left"]) => ({ right: inset, left: inset }),
  insetY: (inset: CSS["top"]) => ({ top: inset, bottom: inset }),

  // margin
  m: (margin: CSS["margin"]) => ({ margin }),
  mt: (marginTop: CSS["margin"]) => ({ marginTop }),
  mr: (marginRight: CSS["marginRight"]) => ({ marginRight }),
  mb: (marginBottom: CSS["marginBottom"]) => ({ marginBottom }),
  ml: (marginLeft: CSS["marginLeft"]) => ({ marginLeft }),
  mx: (marginX: CSS["marginLeft"]) => ({
    marginLeft: marginX,
    marginRight: marginX,
  }),
  my: (marginY: CSS["marginTop"]) => ({
    marginTop: marginY,
    marginBottom: marginY,
  }),
  mil: (marginInline: CSS["marginInline"]) => ({ marginInline }),
  mbl: (marginBlock: CSS["marginBlock"]) => ({ marginBlock }),
  spaceX: (space: CSS["margin"]) => ({
    "& > * + *": { marginLeft: space },
  }),
  spaceY: (space: CSS["margin"]) => ({
    "& > * + *": { marginTop: space },
  }),

  // padding
  p: (padding: CSS["padding"]) => ({ padding }),
  pt: (paddingTop: CSS["paddingTop"]) => ({ paddingTop }),
  pr: (paddingRight: CSS["paddingRight"]) => ({ paddingRight }),
  pb: (paddingBottom: CSS["paddingBottom"]) => ({
    paddingBottom,
  }),
  pl: (paddingLeft: CSS["paddingLeft"]) => ({ paddingLeft }),
  px: (paddingX: CSS["paddingLeft"]) => ({
    paddingLeft: paddingX,
    paddingRight: paddingX,
  }),
  py: (paddingY: CSS["paddingTop"]) => ({
    paddingTop: paddingY,
    paddingBottom: paddingY,
  }),

  // size
  w: (width: CSS["width"]) => ({ width }),
  minW: (minWidth: CSS["minWidth"]) => ({ minWidth }),
  maxW: (maxWidth: CSS["maxWidth"]) => ({ maxWidth }),
  h: (height: CSS["height"]) => ({ height }),
  minH: (minHeight: CSS["minHeight"]) => ({ minHeight }),
  maxH: (maxHeight: CSS["maxHeight"]) => ({ maxHeight }),
  size: (size: CSS["width"]) => ({
    width: size,
    height: size,
  }),
  minSize: (size: CSS["minWidth"]) => ({
    minWidth: size,
    minHeight: size,
  }),
  maxSize: (size: CSS["maxWidth"]) => ({
    maxWidth: size,
    maxHeight: size,
  }),

  //
  align: (align: CSS["textAlign"]) => ({
    textAlign: align,
  }),
  colEnd: (gridColumnEnd: CSS["gridColumnEnd"]) => ({
    gridColumnEnd,
  }),
  colSpan: (cols: number | "full" | "auto") => {
    if (cols === "auto") {
      return {
        gridColumn: "auto",
      };
    }
    if (cols === "full") {
      return {
        gridColumn: "1 / -1",
      };
    }
    return {
      gridColumn: `span ${cols} / span ${cols}`,
    };
  },
  colStart: (gridColumnStart: CSS["gridColumnStart"]) => ({
    gridColumnStart,
  }),
  d: (display: CSS["display"]) => ({ display }),
  flexDir: (flexDirection: CSS["flexDirection"]) => ({
    flexDirection,
  }),
  fontScale: (scale: number) => {
    const [fontSize, lineHeight] =
      fontScales[scale.toString()] || fontScales["1"];
    return {
      fontSize: rem(fontSize),
      lineHeight: em(lineHeight, fontSize),
      letterSpacing: `${getLetterSpacing(fontSize)}em`,
    };
  },
  gridCols: (cols: number | "none" | (string & {})) =>
    typeof cols === "number"
      ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
      : { gridTemplateColumns: cols },
  gridRows: (rows: number | "none" | (string & {})) =>
    typeof rows === "number"
      ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }
      : { gridTemplateRows: rows },
  items: (items: CSS["alignItems"]) => ({
    alignItems: items,
  }),
  justify: (justify: CSS["justifyContent"]) => ({
    justifyContent: justify,
  }),
  lineClamp: (lineClamp: CSS["lineClamp"]) => ({
    "-webkit-line-clamp": lineClamp,
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
  }),
  rowEnd: (gridRowEnd: CSS["gridRowEnd"]) => ({
    gridRowEnd,
  }),
  rowSpan: (rows: number | "full" | "auto") => {
    if (rows === "auto") {
      return {
        gridRow: "auto",
      };
    }
    if (rows === "full") {
      return {
        gridRow: "1 / -1",
      };
    }
    return {
      gridRow: `span ${rows} / span ${rows}`,
    };
  },
  rowStart: (gridRowStart: CSS["gridRowStart"]) => ({
    gridRowStart,
  }),

  // SPECIALS
  // The ones that accept css as an argument
  print: (css: CSS) => ({
    "@media print": css,
  }),
  dark: (css: CSS) => ({
    '&[data-theme="dark"], [data-theme="dark"] &': css,
  }),
  light: (css: CSS) => ({
    '&[data-theme="light"], [data-theme="light"] &': css,
  }),
};
