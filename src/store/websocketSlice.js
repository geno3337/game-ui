import { createSlice } from '@reduxjs/toolkit';

const websocketSlice = createSlice({
  name: 'websocket',
  initialState: {
    stompClient: null
  },
  reducers: {
    setStompClient: (state, action) => {
      state.stompClient = action.payload;
    }
  }
});

export const { setStompClient } = websocketSlice.actions;
export default websocketSlice.reducer;
