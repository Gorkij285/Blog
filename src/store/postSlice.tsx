import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import type { ArticlesState } from '../types/types';

export const fetchSoloArticle = createAsyncThunk('soloArticle/fetchSoloArticle', async (slug: string) => {
  const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  const obj = response.data.article;
  sessionStorage.setItem('post', JSON.stringify(obj));
  return response.data.article;
});

const initialState: ArticlesState = {
  articlesData: [],
  currentArticle: {
    author: {
      username: '',
      image: '',
      following: false,
    },
    body: '',
    createdAt: '',
    description: '',
    favorited: false,
    favoritesCount: 0,
    slug: '',
    tagList: [],
    title: '',
    updatedAt: '',
  },
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSoloArticle.fulfilled, (state, action) => {
      state.currentArticle = action.payload;
    });
  },
});

export default articleSlice.reducer;
