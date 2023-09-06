import type * as Native from "csstype";
import type * as TypeUtils from "./type-utils";

// -------------------------------------------------------------------------------------------------
// CSS
// -------------------------------------------------------------------------------------------------

interface NativeCssProperties
  extends Native.Properties<string | number, string | number>,
    Native.PropertiesHyphen<string | number, string | number>,
    Native.SvgProperties<string | number, string | number>,
    Native.SvgPropertiesHyphen<string | number, string | number> {}

type ValueByPropertyName<PropertyName> =
  PropertyName extends keyof NativeCssProperties
    ? NativeCssProperties[PropertyName]
    : never;

export type CSS<Media = {}, Utils = {}> =
  // nested at-rule css styles
  {
    [K in TypeUtils.Prefixed<"@", keyof Media>]?: CSS<Media, Utils>;
  } & {
    // provide autocomplete for simple pseudos
    [K in Native.SimplePseudos]?: CSS<Media, Utils>;
  } & {
    // known utility styles
    [K in keyof Utils]?: Utils[K] extends (arg: infer P) => any
      ? (P extends any[] ? never[] | P : never) | P
      : never;
  } & {
    // known property styles
    [K in keyof NativeCssProperties as K extends keyof Utils ? never : K]?:
      | ValueByPropertyName<K>
      | Native.Globals
      | TypeUtils.Index
      | undefined;
  } & {
    // unknown property styles
    [K: string]: number | string | CSS<Media, Utils> | {} | undefined;
  };

export type CSSProp<
  Config extends { media: unknown; utils: unknown } = { media: {}; utils: {} }
> =
  | CSS<Config["media"], Config["utils"]>
  | Array<CSS<Config["media"], Config["utils"]> | boolean | null | undefined>;

// -------------------------------------------------------------------------------------------------
// Register
// -------------------------------------------------------------------------------------------------

export type StyleConfig = {
  theme?: Record<string, any>;
  media?: Record<string, string>;
  utils?: Record<string, (value: any) => CSS<{}, {}>>;
};

export interface Register {}

export type RegisteredConfig = Register extends {
  config: infer TConfig extends any;
}
  ? TConfig
  : never;

export type RegisteredTheme = RegisteredConfig extends {
  theme: infer TTheme extends any;
}
  ? TTheme
  : never;

export type RegisteredMedia = RegisteredConfig extends {
  media: infer TMedia extends any;
}
  ? TMedia
  : never;

export type RegisteredUtils = RegisteredConfig extends {
  utils: infer TUtils extends any;
}
  ? TUtils
  : never;

export type RegisteredCSS = CSS<RegisteredMedia, RegisteredUtils>;
