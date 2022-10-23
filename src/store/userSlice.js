import { createSlice, createReducer, isAnyOf, createAsyncThunk } from '@reduxjs/toolkit';
import { app } from '../firebase';
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";

const initialState = {
  user: null,
};

const auth = getAuth(app);

const loginUser = createAsyncThunk(
  'users/login',
  async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    })
  },
});

const uReducer = createReducer(initialState, builder => {
  builder
    .addMatcher(
      isAnyOf(
        loginUser.fulfilled,
      ),
      (state, action) => {
        state.user = action.payload;
      }
    )
    .addMatcher(
      isAnyOf(
        loginUser.rejected,
      ),
      state => {
        state.user = null;
      }
    );
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;

export { loginUser };

export { uReducer };