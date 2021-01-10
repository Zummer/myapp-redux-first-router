import {config} from '../server/config';
import routesMap from './routesMap';
import jwt from 'jsonwebtoken';
// import {User} from 'server/models/User';
import {IAppState, IAppUser} from './Models';

export const isServer = typeof window === 'undefined';
const ssrRest =
  process.env.NODE_ENV === 'production'
    ? 'https://rfr.afanasiev.xyz'
    : 'http://localhost:3000';
export const apiRest = isServer ? 'http://localhost:3000' : ssrRest;

export const fetchData = async (path, jwToken) =>
  fetch(`${apiRest}${path}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwToken || ''}`,
    },
  }).then((data) => data.json());

export const isAllowed = (type, state) => {
  const role = routesMap[type] && routesMap[type].role; // you can put arbitrary keys in routes
  if (!role) {
    return true;
  }

  // вот тут проверяется можно ли показать страницу пользователю или нет
  // это другое по сравнению с проверкой в api
  const user: IAppUser = isServer
    ? getUser(state.jwToken)
    : userFromState(state);

  if (!user) {
    return false;
  }

  return user.roles.includes(role);
};

const getUser = (token: string): IAppUser => {
  if (!token) {
    return null;
  }

  const user: any = jwt.verify(token, config.jwtSecret);
  // const user = await User.findById(decoded.id);

  return user;
};

// VERIFICATION MOCK:
// since middleware is syncrhonous you must use a jwt package that is sync
// like the one imported above. For now we will mock both the client + server
// verification methods:

const userFromState = ({auth}: IAppState): IAppUser => auth.user;
//const jwt = {
//  verify: (jwToken, secret) => jwToken === 'real' && fakeUser,
//};

// NOTE ON COOKIES:
// we're doing combination cookies + jwTokens because universal apps aren't
// single page apps (SPAs). Server-rendered requests, when triggered via
// direct visits by the user, do not have headers we can set. That's the
// takeaway.

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
