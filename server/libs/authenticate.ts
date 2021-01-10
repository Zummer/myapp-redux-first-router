import jwt from 'jsonwebtoken';
import {config} from '../config';
import {User} from '../models/User';

export const authenticate = async (ctx, next) => {
  const authorizationHeader = ctx.headers.authorization;

  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (!token) {
    ctx.status = 403;
    ctx.body = {message: 'Нет ключа-токена'};
  } else {
    try {
      const decoded: any = await jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      if (!user) {
        ctx.status = 404;
        ctx.body = {message: 'Нет такого пользователя'};
      } else {
        return next();
      }
    } catch (error) {
      ctx.status = 401;
      ctx.body = {message: 'Авторизоваться не удалось'};
    }
  }
};
