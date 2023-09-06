import { getSvgPath } from "figma-squircle";
import { onCleanup } from "solid-js";

function getPixelValue(styles: CSSStyleDeclaration, prop: string) {
  return Number(styles.getPropertyValue(prop).slice(0, -2) || "0");
}

export function createSquircle(ref: HTMLElement) {
  let onResize = () => {
    let styles = window.getComputedStyle(ref);
    let rect = ref.getBoundingClientRect();

    ref.style.setProperty(
      "clip-path",
      `path("${getCachedSVGPath({
        width: rect.width,
        height: rect.height,
        topRightCornerRadius: getPixelValue(styles, "border-top-right-radius"),
        topLeftCornerRadius: getPixelValue(styles, "border-top-left-radius"),
        bottomRightCornerRadius: getPixelValue(
          styles,
          "border-bottom-right-radius"
        ),
        bottomLeftCornerRadius: getPixelValue(
          styles,
          "border-bottom-left-radius"
        ),
      })}")`
    );
    ref.style.setProperty("overflow", "hidden");
  };
  let ro = new ResizeObserver(() => {
    onResize();
  });
  ro.observe(ref);
  onCleanup(() => {
    ro.disconnect();
  });
}

const cache: Record<string, string | undefined> = Object.create(null) as Record<
  string,
  string | undefined
>;
function getCachedSVGPath(opts: {
  width: number;
  height: number;
  topRightCornerRadius: number;
  topLeftCornerRadius: number;
  bottomRightCornerRadius: number;
  bottomLeftCornerRadius: number;
}) {
  let {
    width,
    height,
    topRightCornerRadius,
    topLeftCornerRadius,
    bottomRightCornerRadius,
    bottomLeftCornerRadius,
  } = opts;
  let key = `${width},${height},${topRightCornerRadius},${topLeftCornerRadius},${bottomRightCornerRadius},${bottomLeftCornerRadius}`;
  if (cache[key]) return cache[key]!;
  return (cache[key] = getSvgPath({ ...opts, cornerSmoothing: 0.6 })) || "";
}
