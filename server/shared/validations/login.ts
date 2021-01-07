import {isEmpty} from 'lodash';
import {ILoginParams, IValidationResult} from 'src/Models';
import Validator from 'validator';

export function validateInput(data: ILoginParams): IValidationResult {
  let errors: any = {};
  const {email} = data;

  Object.keys(data).forEach((key) => {
    if (isEmpty(data[key])) {
      errors[key] = 'Это поле обязательное';
    }
  });

  if (!errors.email && !Validator.isEmail(email)) {
    errors.email = 'Неправильный email';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
