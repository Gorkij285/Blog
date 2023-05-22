import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { ListState } from '../types/types';

export const fetchList = createAsyncThunk('listInfo/fetchList', async (page: number, { rejectWithValue }) => {
  try {
    let pages = Number(sessionStorage.getItem('page')) * 5 - 5;
    if (pages < 0) {
      pages = 0;
      sessionStorage.setItem('page', '1');
    }
    const res = await axios
      .get(`https://blog.kata.academy/api/articles?limit=5&offset=${pages}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
    return res;
  } catch (error) {
    console.log('ЧТО-ТО С ЗАПРОСОМ', error);
    rejectWithValue(error);
  }
});

const initialState: ListState = {
  data: [],
  limitData: 0,
  status: null,
  error: null,
  loading: true,
  page: 0,
};

const listInfo = createSlice({
  name: 'listInfo',
  initialState,
  reducers: {
    togglePage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchList.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchList.fulfilled, (state, action) => {
      state.status = 'resolved';
      state.data = action.payload.articles;
      state.limitData = action.payload.articlesCount;
    });
    builder.addCase(fetchList.rejected, (state) => {
      state.status = 'rejected';
    });
  },
});

export const { togglePage } = listInfo.actions;

export default listInfo.reducer;
