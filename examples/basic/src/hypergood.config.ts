import type { CSSProp, StyleConfig } from "@hypergood/css";
import { RECOMMENDED_MEDIA, RECOMMENDED_UTILS } from "@hypergood/css/presets";

export const styleConfig = {
  media: RECOMMENDED_MEDIA,
  utils: RECOMMENDED_UTILS,
} satisfies StyleConfig;

declare module "@hypergood/css" {
  interface Register {
    config: typeof styleConfig;
  }
}

type CustomCSS = CSSProp<typeof styleConfig>;
declare module "solid-js" {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: CustomCSS;
    }
    interface CustomAttributes<T> {
      css?: CustomCSS;
    }
  }
}
