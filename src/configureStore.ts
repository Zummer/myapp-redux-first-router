import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction';
import {connectRoutes} from 'redux-first-router';
import api from './middlewares/api';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import routesMap from './routesMap';
import options from './options';
import * as reducers from './reducers';
import * as actionCreators from './actions';
import jwtDecode from 'jwt-decode';
import {IAppUser} from './Models';
import {loggedIn} from './actions/login';
import {isBrowser} from './utils';

export default (preLoadedState, initialEntries?: any) => {
  const {reducer, middleware, enhancer, thunk} = connectRoutes(routesMap, {
    ...options,
    initialEntries,
  });

  const middlewares = [middleware, api, reduxThunk, logger];

  const rootReducer: any = combineReducers({...reducers, location: reducer});
  const enhancers: any = composeEnhancers(
    enhancer,
    applyMiddleware(...middlewares)
  );
  const store = createStore(rootReducer, preLoadedState, enhancers);

  if (isBrowser() && localStorage.jwtToken) {
    const user = jwtDecode<IAppUser>(localStorage.jwtToken);

    store.dispatch(loggedIn(user));
  }

  //@ts-ignore
  if (module.hot && process.env.NODE_ENV === 'development') {
    //@ts-ignore
    module.hot.accept('./reducers/index', () => {
      const reducers = require('./reducers/index');
      const rootReducer = combineReducers({...reducers, location: reducer});
      store.replaceReducer(rootReducer);
    });
  }

  return {store, thunk};
};

const composeEnhancers = (...args) =>
  typeof window !== 'undefined'
    ? composeWithDevTools({actionCreators})(...args)
    : compose(...args);
