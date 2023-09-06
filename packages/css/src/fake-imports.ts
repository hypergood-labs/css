import { RegisteredCSS, RegisteredTheme } from "./types";
import type * as TypeUtils from "./type-utils";
import { ValidComponent } from "solid-js";
import { DynamicProps } from "solid-js/web";

// -------------------------------------------------------------------------------------------------
// theme
// -------------------------------------------------------------------------------------------------

export const theme: RegisteredTheme = new Proxy(
  {},
  {
    get: (_, key) => {
      throw new Error(`\`@hypergood/css\`: Vite plugin not installed.`);
    },
  }
);

// -------------------------------------------------------------------------------------------------
// css
// -------------------------------------------------------------------------------------------------

export function css(styles: RegisteredCSS): string {
  // throw new Error(`\`@hypergood/css\`: Vite plugin not installed.`);
  return "";
}

// -------------------------------------------------------------------------------------------------
// styled
// -------------------------------------------------------------------------------------------------

export function styled<
  Component extends ValidComponent,
  Styles extends {
    variants?: {
      [Name in string]: {
        [Pair in number | string]: RegisteredCSS;
      };
    };
    defaultVariants?: {
      [Index in keyof Styles["variants"]]?: TypeUtils.Widen<
        keyof Styles["variants"][Index]
      >;
    };
    compoundVariants?: Array<
      {
        [Index in keyof Styles["variants"]]?: TypeUtils.Widen<
          keyof Styles["variants"][Index]
        >;
      } & { css: RegisteredCSS }
    >;
  } & RegisteredCSS
>(component: Component, styles: Styles) {
  return function <T extends ValidComponent = Component>(
    props: Omit<DynamicProps<T>, "component"> & {
      component?: T;
    } & {
      [Index in keyof Styles["variants"]]?: TypeUtils.Widen<
        keyof Styles["variants"][Index]
      >;
    }
  ) {
    throw new Error(`\`@hypergood/css\`: Vite plugin not installed.`);
  };
}
