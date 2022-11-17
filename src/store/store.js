import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tasksReducer from './tasksSlice';

const rootReducer = combineReducers({
  users: userReducer,
  tasks: tasksReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware()
});