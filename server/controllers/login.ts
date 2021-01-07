import {v4} from 'uuid';
import passport from '../libs/passport';

export const login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {message: 'Неправильный пароль или пользователь'};
      console.log('login info:', info);
      return;
    }

    const token = v4();

    ctx.body = {token};
  })(ctx, next);
};
