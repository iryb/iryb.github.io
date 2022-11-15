import { firestore, auth, storage } from '../../firebase'
import { doc, getDoc, getDocs, deleteDoc, updateDoc, collection, addDoc, query, 
  where, Timestamp } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { formatDate } from '@helpers/helpers';

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
      let assigneeName, photo;
      if(doc.data().assignedUserId) {
        assigneeName = await getUserNameById(doc.data().assignedUserId);
        photo = await getUserPhotoById(doc.data().assignedUserId);
      }

      const task = {
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        attachments: doc.data().attachments,
        assignedUser: assigneeName,
        assigneePhotoURL: photo,
        assignedUserId: doc.data().assignedUserId,
        deadline: formatDate(doc.data().deadline),
        createdAt: formatDate(doc.data().createdAt),
        updatedAt: formatDate(doc.data().updatedAt),
        status: doc.data().status
      };

      return task;
  }));

  return data;
}

export const getTask = async (id) => {
  const docRef = doc(firestore, "tasks", id);
  const taskDoc = await getDoc(docRef);

  if (taskDoc.exists()) {
    let assigneeName, photo;
    if (taskDoc.data().assignedUserId) {
      assigneeName = await getUserNameById(taskDoc.data().assignedUserId);
      photo = await getUserPhotoById(taskDoc.data().assignedUserId);
    }

    const task = {
      id: taskDoc.id,
      title: taskDoc.data().title,
      content: taskDoc.data().content,
      attachments: taskDoc.data().attachments,
      assignedUser: assigneeName,
      assigneePhotoURL: photo,
      assignedUserId: taskDoc.data().assignedUserId,
      deadline: formatDate(taskDoc.data().deadline),
      createdAt: formatDate(taskDoc.data().createdAt),
      updatedAt: formatDate(taskDoc.data().updatedAt),
      status: taskDoc.data().status
    };

    return task;
  } else {
    return null;
  }
}

export const addTask = async (inputData) => {
  const { content, title, user, attachments, deadline } = inputData;
  let filesArr = [];

  if (attachments) {
    filesArr = await Promise.all(
      attachments.map(async file => {
        const fileRef = ref(storage, file.name);
        await uploadBytes(
          fileRef, 
          file,
          { contentType: 'image/jpeg' }
        );

        return await getDownloadURL(fileRef);
      })
    );
  }

  const taskData = {
    assignedUserId: user,
    content : content,
    title : title,
    status : "to do",
    attachments: filesArr,
    deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(collection(firestore, "tasks"), taskData);
  const data = await getTask(docRef.id);

  return data;
}

export const updTask = async (inputData) => {
  const { id, content, title, user, attachments, deadline } = inputData;
  let filesArr = [];

  if (attachments) {
    filesArr = await Promise.all(
      attachments.map(async file => {
        const fileRef = ref(storage, file.name);
        await uploadBytes(
          fileRef, 
          file,
          { contentType: 'image/jpeg' }
        );

        return await getDownloadURL(fileRef);
      })
    );
  }

  await updateDoc(doc(firestore, "tasks", id), {
    assignedUserId: user,
    content : content,
    title : title,
    deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null,
    attachments: filesArr,
    updatedAt: Timestamp.now()
  })

  const data = await getTask(id);

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

export const deleteTask = async ({ taskId }) => {
  await deleteDoc(doc(firestore, "tasks", taskId))
  .catch(e => {
    throw new Error(e.message);
  });

  return taskId;
}