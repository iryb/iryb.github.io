import { firestore } from '../../firebase'
import { doc, getDoc, getDocs, collection } from "firebase/firestore"; 

export const getUserNameById = async (id) => {
  const docRef = doc(firestore, "users", id)
  let userData = await getDoc(docRef)

  if (userData.exists()) {
    let userName = userData.data().name
    return userName
  } else {
    return null
  }
}

export const getUserPhotoById = async (id) => {
  const docRef = doc(firestore, "users", id)
  let userData = await getDoc(docRef)

  if (userData.exists()) {
    return userData.data().photoURL
  } else {
    return null
  }
}

export const getTasks = async () => {
  const querySnapshot  = await getDocs(collection(firestore, "tasks"));

  const data = await Promise.all(
    await querySnapshot.docs.map( async doc => {
    const assigneeName = await getUserNameById(doc.data().assignedUserId);
    const photo = await getUserPhotoById(doc.data().assignedUserId);

    const task = {
      id: doc.id, 
      assignedUser: assigneeName,
      assigneePhotoURL: photo,
      ...doc.data()
    };

    return task;
  }));

  return data;
}