/**
 * All the information needed to generate a CSS class.
 *
 * All values should be formatted as CSS expects, e.g. kebab-case for properties, at-rules including the @, etc.
 *
 * use & to refer to the class name within the selector
 */
export type Declaration = {
  selector: string;
  property: string;
  value: string;
  atRules: string[];
};
