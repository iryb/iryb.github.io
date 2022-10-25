import { app } from '../../firebase';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const auth = getAuth(app)

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email)
  .catch(e => {
    throw new Error(e.message);
  });
}

export const signInByEmail = async ({ email, password }) => {
  const { displayName, photoURL } = await signInWithEmailAndPassword(auth, email, password);
  return { displayName, email, photoURL };
}

export const signOut = async () => await auth.signOut();

export const signUpByEmail = async ({ name, email, password }) => {
  const newUser = await createUserWithEmailAndPassword(auth, email, password)
  .catch(e => {
    throw new Error(e.message);
  });

  await updateProfile(auth.currentUser, {
    displayName: name
  })
  .catch(e => {
    throw new Error(e.message);
  });

  return { 
    displayName: newUser.user.displayName,
    email: newUser.user.email,
    photoURL: newUser.user.photoURL
  };
}