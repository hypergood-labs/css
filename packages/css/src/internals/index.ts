import { createComponent, Dynamic, mergeProps } from "solid-js/web";
import { splitProps } from "solid-js";

/**
 * Merge class names such that any classnames that are overridden by a later
 * classname are removed.
 */
export function mergeClassNames(...classNameArr: string[]) {
  let classNames = classNameArr.join(" ").split(/\s+/);
  let classMap = Object.create(null) as Record<string, string>;
  for (let className of classNames) {
    if (className.startsWith("x") && className.includes("-")) {
      classMap[className.split("-")[0]!] = className;
    } else {
      classMap[className] = className;
    }
  }

  return Object.values(classMap).join(" ");
}

export function createStyledComponent(
  tag: any,
  // The base class name includes the classes from any default variants.
  baseClassName: string,
  variants: {
    [variantName: string]: {
      [variantValue: string]: string;
    };
  },
  compoundVariants: Array<{
    css: string;
    [variantName: string]: string | number | boolean;
  }> = []
) {
  const variantNames = Object.keys(variants);
  return function StyledComponent(props: any) {
    let [, domProps] = splitProps(props, variantNames);

    let variantClassNames = () =>
      variantNames
        .map((name) => variants[props[name]?.toString() || ""] || "")
        .join(" ");

    let compoundVariantClassNames = () =>
      compoundVariants
        .filter((variant) =>
          Object.entries(variant).every(
            ([name, value]) =>
              name === "css" || props[name]?.toString() === value
          )
        )
        .map((variant) => variant.css)
        .join(" ");

    return createComponent(
      Dynamic,
      mergeProps(domProps, {
        get component() {
          return props.component || tag;
        },
        get class() {
          return mergeClassNames(
            baseClassName,
            variantClassNames(),
            compoundVariantClassNames(),
            props.class
          );
        },
      })
    );
  };
}
