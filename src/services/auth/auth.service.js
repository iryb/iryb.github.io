import { app } from '../../firebase';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(app)

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email)
  .catch(e => {
    throw new Error(e.message);
  });
}