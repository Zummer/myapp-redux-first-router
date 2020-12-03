const Koa = require('koa');
const middleware = require('./middleware');
require('dotenv').config();
const PORT = process.env.NODE_SERVER_PORT || 3000;

const app = new Koa();

middleware(app);

app.listen(PORT, () => {
  console.log(`Listening @ http://localhost:${PORT}/`);
});
