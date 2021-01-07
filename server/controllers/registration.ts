// const {v4: uuid} = require('uuid');
import { validateInput } from '../shared/validations/register';
import {User} from '../models/User';

// const verificationToken = uuid();
export const register = async (ctx, next) => {
  const {isValid, errors} = validateInput(ctx.request.body);

  if (!isValid) {
    ctx.status = 400;
    ctx.body = {errors};
  } else {
    const user = new User({
      email: ctx.request.body.email,
      displayName: ctx.request.body.displayName,
    });
  
    await user.setPassword(ctx.request.body.password);
    await user.save();
  
    ctx.body = {status: 'ok'};
  }
};
