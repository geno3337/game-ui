import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: { player1: null, player2: null },
  reducers: {
    updateGameState: (state, action) => action.payload,
  },
});

export const { updateGameState } = gameSlice.actions;
export default gameSlice.reducer;
