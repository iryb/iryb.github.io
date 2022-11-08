import { auth, firestore, storage } from '../../firebase';
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { updateDoc, doc, getDoc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const updateUserName = (name) => {
  updateProfile(auth.currentUser, {
    displayName: name
  })
  .then(() => updateDoc(doc(firestore, "users", auth.currentUser.uid), {
    name : name
  }))
  .catch(e => {
    throw new Error(e.message);
  });

  return name;
}

export const updateUserEmail = (email) => {
  return updateEmail(auth.currentUser, email)
  .then(() => {
    updateDoc(doc(firestore, "users", auth.currentUser.uid), {
      email : email
    })
  })
  .catch(e => {
    throw new Error(e.message);
  });
}

export const updateUserPassword = (password) => {
  return updatePassword(auth.currentUser, password)
  .catch(e => {
    throw new Error(e.message);
  });
}

export const getUserRole = async () => {
  const docRef = doc(firestore, "users", auth.currentUser.uid);

  let userData = await getDoc(docRef);

  if (userData.exists()) {
    let userRole = userData.data().role;
    console.log('service', userRole);
    return userRole;
  } else {
    return null;
  }
}

export const updateUserRole = (role) => {
  return updateDoc(doc(firestore, "users", auth.currentUser.uid), {
    role : role
  })
  .catch(e => {
    throw new Error(e.message);
  });
}

export const updateUserPhoto = (photo) => {
  const fileRef = ref(storage, `${auth.currentUser.uid}.jpg`);
  uploadBytes(
    fileRef, 
    photo,
    { contentType: 'image/jpeg' }
  ).then(() => {
    getDownloadURL(fileRef).then((url) => {
      updateProfile(auth.currentUser, {
        photoURL: url
      })
      .catch(e => {
        throw new Error(e.message);
      });
    });
  })
}

export const updateUserProfile = data => {
  const { name, email, password, role, photo } = data;
  const promises = [];

  if(name) {
    promises.push(updateUserName(name));
  }

  if(email) {
    promises.push(updateUserEmail(email));
  }

  if(password) {
    promises.push(updateUserPassword(password));
  }

  if(role) {
    promises.push(updateUserRole(role));
  }

  if(photo) {
    promises.push(updateUserPhoto(photo));
  }

  const user = Promise.all(promises)
  .then(() => {
    const { displayName, email, photoURL } = auth.currentUser;

    return { 
      displayName, 
      email, 
      photoURL,
      role
    };
  })
  .catch(e => {
    throw new Error(e.message);
  });

  return user;
}