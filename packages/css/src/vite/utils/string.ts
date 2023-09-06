function toChar63(number: number) {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
  return chars[number - 1];
}

/**
 * Oops it's actually base 63, got rid of the hyphen so i could use it as a delimiter
 */
export function toBase64ish(number: number): string {
  let string = "";
  let _number = number;

  while (_number > 0) {
    string = string + toChar63(_number % 63 || 63);
    _number = Math.floor((_number - 1) / 63);
  }

  return string;
}

/** Returns the given value converted to camel-case. */
export const toCamelCase = (value: string) =>
  !/[A-Z]/.test(value)
    ? value.replace(/-[^]/g, (capital) => capital[1].toUpperCase())
    : value;

/** Returns the given value converted to kebab-case. */
export const toKebabCase = (value: string) =>
  // ignore kebab-like values
  value.includes("-")
    ? value
    : // replace any upper-case letter with a dash and the lower-case variant
      value.replace(/[A-Z]/g, (capital) => "-" + capital.toLowerCase());
