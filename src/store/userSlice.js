import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { app } from '../firebase';
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";

const initialState = {
  user: null,
};

const auth = getAuth(app);

const login = createAsyncThunk(
  'users/login',
  async ({ email, password }) => {
    const { displayName, photoURL } = await signInWithEmailAndPassword(auth, email, password);
    return { displayName, email, photoURL };
  }
);

const logout = createAsyncThunk(
  'users/logout',
  async () => {
    await auth.signOut();
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    }),
    builder.addCase(logout.fulfilled, state => {
      state.user = null;
    })
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;

export { login, logout };