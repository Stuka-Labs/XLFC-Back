import * as validator from "validator";

export const sanitizeEmail = (value: string): string | false => {
  try {
    return validator.normalizeEmail(value);
  } catch (err) {
    return false;
  }
};

export const escapeString = (value: string): string | false => {
  try {
    return validator.escape(value);
  } catch (err) {
    return false;
  }
};
