import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, getUserNameById, addTask, addTaskComment, getTaskComments } from '@services/services';

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

const addComment = createAsyncThunk(
  'tasks/addTaskComment',
  async ({ text, taskId }) => await addTaskComment({ text, taskId })
);

const getComments = createAsyncThunk(
  'tasks/getComments',
  async ({ taskId }) => await getTaskComments({ taskId })
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
    }),
    builder.addCase(getComments.fulfilled, (state, action) => {
      const { id, comments } = action.payload;
      const taskIdx = state.tasksList.findIndex(t => t.id === id);
      state.tasksList[taskIdx].comments = comments;
    }),
    builder.addCase(addComment.fulfilled, (state, action) => {
      const { taskId } = action.payload;
      const taskIdx = state.tasksList.findIndex(t => t.id === taskId);
      state.tasksList[taskIdx].comments.push(action.payload);
    })
  }
});

export const selectTasks = (state) => state.tasks.tasksList;

export default tasksSlice.reducer;

export { setTasks, getAssigneeInfo, addNewTask, addComment, getComments };