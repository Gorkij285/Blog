import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { ProfileState, loginType, UpdateType } from '../types/types';

export const postProfile = createAsyncThunk('profileInfo/postProfile', async (obj: object) => {
  const newObj = {
    ...obj,
  };
  console.log(newObj);
  try {
    const response = await axios.post('https://blog.kata.academy/api/users', newObj);
    localStorage.setItem('token', response.data.user.token);
    return response.data;
  } catch (error) {
    console.log('ЧТО-ТО С ЗАПРОСОМ', error);
  }
});

export const fetchUser = createAsyncThunk('profileInfo/fetchUser', async () => {
  const response = await axios.get('https://blog.kata.academy/api/user', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
});

export const fetchLogin = createAsyncThunk(
  'profileInfo/fetchLogin',
  async (loginType: loginType, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://blog.kata.academy/api/users/login', { user: loginType });
      localStorage.setItem('token', response.data.user.token);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchUpdateProfile = createAsyncThunk('profileInfo/fetchUpdateProfile', async (user: UpdateType) => {
  console.log(user);
  try {
    const response = await axios.put('https://blog.kata.academy/api/user', user, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    localStorage.setItem('token', response.data.user.token);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const initialState: ProfileState = {
  user: {
    username: '',
    email: '',
    password: '',
    token: '',
  },
  error: null,
  loading: false,
  isLogged: false,
  status: '',
  updateCounter: 0,
};

const profileInfo = createSlice({
  name: 'profileInfo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    update: (state) => {
      state.updateCounter = state.updateCounter + 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postProfile.pending, (state, action) => {
      state.status = 'pending';
    });
    builder.addCase(postProfile.fulfilled, (state, action) => {
      state.status = 'resolved';
      state.error = action.payload === undefined ? true : false;
      state.isLogged = action.payload === undefined ? false : true;
      state.user = action.payload !== undefined ? action.payload.user : state.user;
    });
    builder.addCase(postProfile.rejected, (state, action) => {
      state.status = 'rejected';
      console.log(action);
    });
    builder.addCase(fetchUser.pending, (state) => {
      // state.userLoading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      // state.userLoading = false;
      state.user = action.payload.user;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      // state.userLoading = false;
    });
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.user = action.payload !== undefined ? action.payload.user : state.user;
      state.isLogged = action.payload === undefined ? false : true;
      state.error = action.payload === undefined ? true : false;
    });
    builder.addCase(fetchLogin.rejected, (state, action) => {
      state.error = action.payload ? false : true;
    });
    builder.addCase(fetchUpdateProfile.fulfilled, (state, action) => {
      state.user = action.payload !== undefined ? action.payload.user : state.user;
      state.error = action.payload === undefined ? true : false;
    });
  },
});

export const { clearError, update } = profileInfo.actions;

export default profileInfo.reducer;
