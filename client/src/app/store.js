// import { configureStore } from '@reduxjs/toolkit';
// import messagesReducer from '../features/messagesSlice';

// export const store = configureStore({
//   reducer: {
//     messages: messagesReducer,
//   },
// });
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import messageReducer from '../features/messagesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messageReducer,
  },
});
