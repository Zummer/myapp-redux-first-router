import {LOAD_MY_DATA_SUCCESS} from '../types';

export default (prevState = {}, action = {}) => {
  let state = prevState;
  switch (action.type) {
    case LOAD_MY_DATA_SUCCESS: {
      const {category, response: videos} = action.payload;
      const slugs = videos.map((video) => video.slug);
      state = {...prevState, [category]: slugs};
      break;
    }
    default:
      state = prevState;
      break;
  }

  return state;
};

// eg: { fp: ['slug-1', 'slug-2'], 'react-redux': ['slug-etc'] }
