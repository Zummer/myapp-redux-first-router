import {isEmpty, isEqual} from 'lodash';
import Validator from 'validator';

export function validateInput(data: any) {
  let errors: any = {};
  const {email, password, passwordRepeat} = data;

  Object.keys(data).forEach((key) => {
    if (isEmpty(data[key])) {
      errors[key] = 'Это поле обязательное';
    }
  });

  if (!errors.email && !Validator.isEmail(email)) {
    errors.email = 'Неправильный email';
  }

  if (!errors.passwordRepeat && !isEqual(password, passwordRepeat)) {
    errors.passwordRepeat = 'Пароль должен совпадать';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
