import * as validator from "validator";
import PasswordValidator from "password-validator";
const ALLOWED_EXTENSIONS_FOR_IMAGE = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "webp",
];

export const validateEmail = (value: string) => {
  try {
    return validator.isEmail(value);
  } catch (err) {
    return false;
  }
};

export const validatePhoneNumber = (value: string) => {
  try {
    // first check if phoneNumber is as per firebase rules
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(value)) {
      return false;
    }

    // now test format
    return validator.isMobilePhone(value, undefined, {strictMode: true});
  } catch (err) {
    return false;
  }
};

export const validateAlphabeticString = (value: string) => {
  try {
    if (!value) return false;
    else if (validator.isEmpty(value, {ignore_whitespace: true})) {
      return false;
    } else if (!validator.isAlpha(value)) return false;
    return true;
  } catch (err) {
    return false;
  }
};

export const validatePassword = (value: string): boolean | string[] => {
  try {
    const schema = new PasswordValidator();
    schema
      .is()
      .min(8)
      .is()
      .max(100)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits(2);
    return schema.validate(value, {list: true});
  } catch (err) {
    return false;
  }
};

export const validateMonth = (month: number): boolean => {
  try {
    if (!month) return false;
    return !validator.isInt(month.toString(), {min: 1, max: 12});
  } catch (error) {
    return false;
  }
};

export const validateWeek = (week: number): boolean => {
  try {
    if (!week) return false;
    return !validator.isInt(week.toString(), {min: 1, max: 52});
  } catch (error) {
    return false;
  }
};

export const validateWeight = (weight: number): boolean => {
  try {
    if (!weight) return false;
    return !validator.isFloat(weight.toString(), {min: 0.1});
  } catch (error) {
    return false;
  }
};

export const validateIsBoolean = (field: boolean): boolean => {
  try {
    if (!field) return false;
    return !validator.isBoolean(field.toString());
  } catch (error) {
    return false;
  }
};

export const validateImageFormat = (ext: string) => {
  return ALLOWED_EXTENSIONS_FOR_IMAGE.includes(ext);
};
