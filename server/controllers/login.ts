import passport from '../libs/passport';
import jwt from 'jsonwebtoken';
import {config} from 'server/config';

export const login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {message: 'Неправильный пароль или пользователь'};
      console.log('login info:', info);
      return;
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        username: user.displayName,
        roles: user.roles,
      },
      config.jwtSecret
    );

    ctx.cookies.set('jwtToken', jwtToken, {httpOnly: false});
    ctx.body = {jwtToken};
  })(ctx, next);
};
