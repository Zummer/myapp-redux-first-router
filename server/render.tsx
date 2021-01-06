import React from 'react';
import ReactDOM from 'react-dom/server';
import {Provider} from 'react-redux';
import {flushChunkNames} from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import configureStore from './configureStore';
import App from '../src/components/App';

export default ({clientStats}) => async (ctx, next) => {
  const store = await configureStore(ctx);
  if (!store) return; // no store means redirect was already served

  const app = createApp(App, store);
  const appString = ReactDOM.renderToString(app);
  const stateJson = JSON.stringify(store.getState());
  const chunkNames = flushChunkNames();
  const {js, styles, cssHash} = flushChunks(clientStats, {chunkNames});

  console.log('REQUESTED PATH:', ctx.path);
  console.log('CHUNK NAMES', chunkNames);

  ctx.body = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>redux-first-router-demo</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
          ${styles}
          <link rel="stylesheet prefetch" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
        </head>
        <body>
          <script>window.REDUX_STATE = ${stateJson}</script>
          <div id="root">${appString}</div>
          ${cssHash}
          ${js}
        </body>
      </html>`;

  await next(); // если этого не сделать то обрывается связь через websocket
};

const createApp = (App, store) => (
  <Provider store={store}>
    <App />
  </Provider>
);
