import { auth, firestore } from "../../firebase";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { getUserRole } from "@services/profile/profile.service";

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email).catch((e) => {
    throw new Error(e.message);
  });
};

export const signInByEmail = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const role = await getUserRole();
  return {
    id: auth.currentUser.uid,
    displayName: user.displayName,
    email,
    photoURL: user.photoURL,
    role,
  };
};

export const signOut = async () => await auth.signOut();

export const signUpByEmail = async ({ name, email, password }) => {
  const newUser = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((e) => {
    throw new Error(e.message);
  });

  await updateProfile(auth.currentUser, {
    displayName: name,
  }).catch((e) => {
    throw new Error(e.message);
  });

  await setDoc(doc(firestore, "users", auth.currentUser.uid), {
    name: name,
    role: "user",
    email: email,
  }).catch((e) => {
    throw new Error(e.message);
  });

  return {
    id: auth.currentUser.uid,
    displayName: newUser.user.displayName,
    email: newUser.user.email,
    photoURL: newUser.user.photoURL,
  };
};

export const deleteProfile = async ({ password }) => {
  let email = auth.currentUser.email;
  let credential = EmailAuthProvider.credential(email, password);
  let uid = auth.currentUser.uid;

  await reauthenticateWithCredential(auth.currentUser, credential).catch(
    (e) => {
      throw new Error(e.message);
    }
  );

  await deleteDoc(doc(firestore, "users", uid)).catch((e) => {
    throw new Error(e.message);
  });

  await deleteUser(auth.currentUser).catch((e) => {
    throw new Error(e.message);
  });

  // .then(()=> {
  //   updateTasksAfterUserDelete(uid)
  // })
};
