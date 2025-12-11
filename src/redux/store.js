// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import userReducer from './userData';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    user: userReducer,
  },
});
