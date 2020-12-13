import {LOAD_MY_DATA_SUCCESS} from '../types';

export default (state = {}, action = {}) => {
    // return state
    switch (action.type) {
        case LOAD_MY_DATA_SUCCESS:
            const {category, response: videos} = action.payload;
            const slugs = videos.map((video) => video.slug);
            return {...state, [category]: slugs};
        default:
            return state;
    }
};

// eg: { fp: ['slug-1', 'slug-2'], 'react-redux': ['slug-etc'] }
