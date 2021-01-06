import Koa from 'koa';
import {middleware} from './middleware';

const app = new Koa();

middleware(app);

app.listen(3000, () => {
  console.log(`Listening @ http://localhost:3000/`);
});
