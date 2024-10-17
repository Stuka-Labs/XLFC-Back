import * as validator from "validator";
import PasswordValidator from "password-validator";

export const validateEmail = (value: string) => {
  try {
    return validator.isEmail(value);
  } catch (err) {
    return false;
  }
};

export const validatePhoneNumber = (value: string) => {
  try {
    return validator.isMobilePhone(value);
  } catch (err) {
    return false;
  }
};

export const validateAlphabeticString = (value: string) => {
  try {
    if (!value) return false;
    else if (validator.isEmpty(value, {ignore_whitespace: true})) return false;
    else if (!validator.isAlpha(value)) return false;
    return true;
  } catch (err) {
    return false;
  }
};

export const validatePassword = (value: string): boolean | string[] => {
  try {
    const schema = new PasswordValidator();
    schema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().digits(2);
    return schema.validate(value, {list: true});
  } catch (err) {
    return false;
  }
};
