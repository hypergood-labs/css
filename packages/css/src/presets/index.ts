export const TAILWIND_MEDIA = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",

  "max-sm": "not all and (min-width: 640px)",
  "max-md": "not all and (min-width: 768px)",
  "max-lg": "not all and (min-width: 1024px)",
  "max-xl": "not all and (min-width: 1280px)",
  "max-2xl": "not all and (min-width: 1536px)",
} as const;

export const BOOTSTRAP_MEDIA = {
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1400px)",
};

export const BULMA_MEDIA = {
  tablet: "(min-width: 769px)",
  desktop: "(min-width: 1024px)",
  widescreen: "(min-width: 1216px)",
  fullhd: "(min-width: 1408px)",
};

export const RECOMMENDED_MEDIA = TAILWIND_MEDIA;

export * from "./utils";
