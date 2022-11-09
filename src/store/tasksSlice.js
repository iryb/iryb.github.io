import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, getUserNameById } from '@services/services';

const initialState = {
  tasksList: [],
};

const setTasks = createAsyncThunk(
  'tasks/setTasks',
  async () => await getTasks()
);

const getAssigneeInfo = createAsyncThunk(
  'tasks/getAssigneeInfo',
  async ({ id }) => await getUserNameById({ id })
);

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(setTasks.fulfilled, (state, action) => {
      state.tasksList = action.payload;
    })
  }
});

export const selectTasks = (state) => state.tasks.tasksList;

export default tasksSlice.reducer;

export { setTasks, getAssigneeInfo };