const Koa = require('koa');
const middleware = require('./middleware');
require('dotenv').config();

const app = new Koa();

middleware(app);

app.listen(3000, () => {
  console.log(`Listening @ http://localhost:3000/`);
});
