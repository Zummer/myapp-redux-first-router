import {LOAD_MY_DATA_SUCCESS} from '../types';

export default (state = {}, action = {}) => {
    switch (action.type) {
        case LOAD_MY_DATA_SUCCESS: {
            const {response: videos} = action.payload;
            return videos.reduce((videos, video) => {
                state[video.slug] = video;
                return videos;
            }, state);
        }
        case 'VIDEO_FOUND': {
            const {slug, video} = action.payload;
            state[slug] = video;
            return state;
        }
        default:
            return state;
    }
};

// eg: { 'slug-1': video1, 'slug-2': video2 }
