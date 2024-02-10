const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const ALPHABET_LENGTH = ALPHABET.length;

function toChar63(number: number) {
  return ALPHABET[number - 1];
}

/**
 * Oops it's actually base 36, limited to lowercase letters and numbers for
 * better compression.
 */
export function toBase64ish(number: number): string {
  let string = "";
  let _number = number;

  while (_number > 0) {
    string = string + toChar63(_number % ALPHABET_LENGTH || ALPHABET_LENGTH);
    _number = Math.floor((_number - 1) / ALPHABET_LENGTH);
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
