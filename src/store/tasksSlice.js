import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, getUserNameById, addTask, addTaskComment, 
  getTaskComments, deleteTask, updTask } from '@services/services';

const initialState = {
  tasksList: [],
  openedTask: null
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
  async ({ content, title, user, attachments, deadline }) => await addTask({ content, title, user, attachments, deadline })
);

const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, content, title, user, attachments, deadline }) => await updTask({ id, content, title, user, attachments, deadline })
);

const removeTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ taskId }) => await deleteTask({ taskId })
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
    setOpenedTask: (state, action) => {
      state.openedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setTasks.fulfilled, (state, action) => {
      state.tasksList = action.payload;
    }),
    builder.addCase(addNewTask.fulfilled, (state, action) => {
      state.tasksList.push(action.payload);
    }),
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const { id } = action.payload;
      const taskIdx = state.tasksList.findIndex(t => t.id === id);
      state.tasksList.splice(taskIdx, 1, action.payload);
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
    }),
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const { taskId } = action.payload;
      const taskIdx = state.tasksList.findIndex(t => t.id === taskId);
      state.tasksList.splice(taskIdx, 1);
    })
  }
});

export const selectTasks = (state) => state.tasks.tasksList;

export const selectOpenedTask = (state) => state.tasks.openedTask?.id;

export const { setOpenedTask } = tasksSlice.actions;

export default tasksSlice.reducer;

export { setTasks, getAssigneeInfo, addNewTask, addComment, 
  getComments, removeTask, updateTask };