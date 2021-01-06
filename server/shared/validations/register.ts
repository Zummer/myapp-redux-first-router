import { isEmpty, isEqual } from "lodash";
import { IUserRegisterParams } from "src/Models";
import Validator from 'validator';

export function validateInput(data: IUserRegisterParams) {
    let errors: any = {};
    const {email, password, passwordRepeat} = data;
  
    Object.keys(data).forEach(key => {
      if (isEmpty(data[key])) {
        errors[key] = 'Это поле обязательное';
      }
    })
  
    if (!errors.email && !Validator.isEmail(email)) {
      errors.email = 'Не правильный email';
    }
  
    if (!errors.passwordRepeat && !isEqual(password, passwordRepeat)) {
      errors.passwordRepeat = 'Пароль должен совпадать';
    }
  
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
