import universal from 'react-universal-component';
import Loading from './Loading';
import Err from './Error';

interface MyNodeRequire extends NodeRequire {
  resolveWeak: (props: any) => number | string;
}

const load = (props) =>
  Promise.all([
    import(/* webpackChunkName: '[request]' */ `./${props.page}`),
  ]).then((proms) => proms[0]);

const UniversalComponent = universal(load, {
  chunkName: (props) => props.page,
  resolve: (props) => (require as MyNodeRequire).resolveWeak(`./${props.page}`),
  minDelay: 500,
  loading: Loading,
  error: Err,
});

export default UniversalComponent;
