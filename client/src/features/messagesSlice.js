import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/messages';

// // Fetch messages
// export const fetchMessages = createAsyncThunk('messages/fetchMessages', async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// });

// // Slice
// const messagesSlice = createSlice({
//   name: 'messages',
//   initialState: { messages: [], status: 'idle' },
//   reducers: {
//     addMessage: (state, action) => {
//       state.messages.push(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMessages.pending, (state) => { state.status = 'loading'; })
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.messages = action.payload;
//       });
//   },
// });

// export const { addMessage } = messagesSlice.actions;
// export default messagesSlice.reducer;
