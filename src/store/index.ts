import { configureStore } from '@reduxjs/toolkit';

import listSlice from './listSlice';
import profileSlice from './profileSlice';
import articleSlice from './articleSlice';
import postSlice from './postSlice';

export default configureStore({
  reducer: {
    list: listSlice,
    profile: profileSlice,
    articles: articleSlice,
    soloArticle: postSlice,
  },
});
