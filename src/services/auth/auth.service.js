import { app, firestore } from '../../firebase';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential,
  deleteUser } from "firebase/auth";
import { setDoc, doc, deleteDoc } from "firebase/firestore"; 

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

  await setDoc(doc(firestore, "users", auth.currentUser.uid), {
    name : name,
    role: "user",
    email : email
  })
  .then(() => console.log('user set'))
  .catch(e => {
    throw new Error(e.message);
  });

  return { 
    displayName: newUser.user.displayName,
    email: newUser.user.email,
    photoURL: newUser.user.photoURL
  };
}

export const deleteProfile = async ({ password }) => {
  let email = auth.currentUser.email;
  let credential = EmailAuthProvider.credential(email, password);
  let uid = auth.currentUser.uid;
  
  await reauthenticateWithCredential(auth.currentUser, credential)
  .catch(e => {
    throw new Error(e.message);
  });

  await deleteDoc(doc(firestore, "users", uid))
  .catch(e => {
    throw new Error(e.message);
  });

  await deleteUser(auth.currentUser)
  .catch(e => {
    throw new Error(e.message);
  });

  // .then(()=> {
  //   updateTasksAfterUserDelete(uid)
  // })
};