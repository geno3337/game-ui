import { createSlice } from '@reduxjs/toolkit';

const inputSlice = createSlice({
  name: 'input',
  initialState: { up: false, down: false, fire: false },
  reducers: {
    setInput: (state, action) => ({ ...state, ...action.payload }),
  },
});

export const { setInput } = inputSlice.actions;
export default inputSlice.reducer;
