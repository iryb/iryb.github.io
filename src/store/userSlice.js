import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { app, 
  // firestore 
} from '../firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { setDoc, doc } from "firebase/firestore"; 


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

const signup = createAsyncThunk(
  'users/signup',
  async ({ name, email, password }) => {
    const newUser = await createUserWithEmailAndPassword(auth, email, password)
    // .then(registeredUser => {
    //   setDoc(doc(firestore, "users", registeredUser.user.uid), {
    //     name : name,
    //     email : registeredUser.user.email
    //   })
    // })
    .catch(e => console.log(e));

    await updateProfile(auth.currentUser, {
      displayName: name
    })
    .catch(e => console.log(e));

    return { 
      displayName: newUser.user.displayName,
      email: newUser.user.email,
      photoURL: newUser.user.photoURL
    };
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
    builder.addCase(signup.fulfilled, (state, action) => {
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

export { login, logout, signup };