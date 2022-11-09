import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, getUserNameById, addTask } from '@services/services';

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

const addNewTask = createAsyncThunk(
  'tasks/addTask',
  async ({ content, title, user }) => await addTask({ content, title, user })
);

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(setTasks.fulfilled, (state, action) => {
      state.tasksList = action.payload;
    }),
    builder.addCase(addNewTask.fulfilled, (state, action) => {
      state.tasksList.push(action.payload);
    })
  }
});

export const selectTasks = (state) => state.tasks.tasksList;

export default tasksSlice.reducer;

export { setTasks, getAssigneeInfo, addNewTask };