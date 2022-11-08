import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInByEmail, signOut, signUpByEmail, updateUserProfile, getUserRole } from '@services/services';


const initialState = {
  user: null,
};

const login = createAsyncThunk(
  'users/login',
  async ({ email, password }) => await signInByEmail({ email, password })
);

const logout = createAsyncThunk(
  'users/logout',
  async () => await signOut()
);

const signup = createAsyncThunk(
  'users/signup',
  async ({ name, email, password }) => await signUpByEmail({ name, email, password })
);

const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (data) => await updateUserProfile(data)
);

const setUserRole = createAsyncThunk(
  'users/setRole',
  async () => await getUserRole()
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
    builder.addCase(signup.fulfilled, (state, action) => {
      state.user = action.payload;
    }),
    builder.addCase(logout.fulfilled, state => {
      state.user = null;
    }),
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    }),
    builder.addCase(setUserRole.fulfilled, (state, action) => {
      state.user.role = action.payload;
    })
  }
});

export const { setUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;

export { login, logout, signup, updateProfile, setUserRole };