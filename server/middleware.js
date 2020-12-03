const {findVideos, findVideo} = require('./api');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router({prefix: '/api'});
const importFresh = require('import-fresh');
const {login} = require('./controllers/login');
const {health} = require('./controllers/health');
const {register} = require('./controllers/registration');

const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('./config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.set('debug', false);

mongoose.plugin(beautifyUnique);

const handleMongooseValidationError = require('./libs/validationErrors');

function middleware(app) {
  mongoose.connect(config.mongodb.uri);

  console.log('config.mongodb.uri', config.mongodb.uri);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log("we're connected from middleware!");
  });

  app.use(bodyParser());

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err.status) {
        ctx.status = err.status;
        ctx.body = {error: err.message};
      } else {
        console.error(err);
        ctx.status = 500;
        ctx.body = {error: 'Internal server error'};
      }
    }
  });

  router.post('/login', login);
  router.post('/register', handleMongooseValidationError, register);
  router.get('/health', health);

  router.get('/videos/:category', async (ctx, next) => {
    const jwToken = 'fake';
    const data = await findVideos(ctx.params.category, jwToken);
    ctx.body = data;
  });

  router.get('/video/:slug', async (ctx, next) => {
    const jwToken = 'fake';
    const data = await findVideo(ctx.params.slug, jwToken);
    ctx.body = data;
  });

  app.use(async (ctx, next) => {
    if (ctx.path.indexOf('api') !== -1) {
      return next();
    }

    const clientStats = importFresh(
      path.resolve(__dirname, '../out/buildServer/stats.json')
    );
    const renderer = importFresh(
      path.resolve(__dirname, '../out/buildServer/serverRender.js')
    ).default;
    const render = renderer({clientStats});
    await render(ctx, next);
  });

  app.use(router.routes());
}

module.exports = middleware;
