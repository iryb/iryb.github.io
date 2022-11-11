import { firestore, auth } from '../../firebase'
import { doc, getDoc, getDocs, collection, addDoc, query, where, Timestamp } from "firebase/firestore"; 

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

export const getTask = async (id) => {
  const docRef = doc(firestore, "tasks", id);
  const taskDoc = await getDoc(docRef);

  if (taskDoc.exists()) {
    const assigneeName = await getUserNameById(taskDoc.data().assignedUserId);
    const photo = await getUserPhotoById(taskDoc.data().assignedUserId);

    const task = {
      id: taskDoc.id, 
      assignedUser: assigneeName,
      assigneePhotoURL: photo,
      ...taskDoc.data()
    };

    return task;
  } else {
    return null;
  }
}

export const addTask = async ({ content, title, user }) => {
  const taskData = {
    assignedUserId: user,
    content : content,
    title : title,
    status : "to do"
  };

  const docRef = await addDoc(collection(firestore, "tasks"), taskData);
  const data = await getTask(docRef.id);

  return data;
}

export const getCommentById = async (id) => {
  const docRef = doc(firestore, "comments", id);
  const commentDoc = await getDoc(docRef);

  if (commentDoc.exists()) {
    const userName = await getUserNameById(commentDoc.data().userId);
    const userPhoto = await getUserPhotoById(commentDoc.data().userId);
    const date = commentDoc.data().datetime ? commentDoc.data().datetime.toDate().toLocaleString() : '';

    const comment = {
      id: commentDoc.id,
      taskId: commentDoc.data().taskId,
      userName: userName,
      userPhoto: userPhoto,
      text: commentDoc.data().text,
      datetime: date
    };

    return comment;
  } else {
    return null;
  }
}

export const addTaskComment = async ({ text, taskId }) => {

  const commentData = {
    datetime: Timestamp.now(),
    taskId,
    text,
    userId: auth.currentUser.uid
  };

  const docRef = await addDoc(collection(firestore, "comments"), commentData);
  const data = await getCommentById(docRef.id);

  return data;
}

export const getTaskComments = async ({ taskId }) => {
  const q = query(collection(firestore, "comments"), where("taskId", "==", taskId));
  const querySnapshot = await getDocs(q);

  const data = await Promise.all(
    await querySnapshot.docs.map( async doc => {
    const { text, datetime, userId } = doc.data();
    const userName = await getUserNameById(userId);
    const userPhoto = await getUserPhotoById(userId);

    const date = datetime ? datetime.toDate().toLocaleString() : '';

    const comment = {
      id: doc.id,
      text,
      datetime: date,
      userName,
      userPhoto
    };

    return comment;
  }));

  return { id: taskId, comments: data };
}