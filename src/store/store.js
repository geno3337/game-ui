import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import inputReducer from './inputSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    input: inputReducer,
  },
});
