import React, { useContext, useState, useEffect } from 'react'
import { app, firestore } from '../firebase'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail, 
  updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { getDoc, getDocs, setDoc, doc, collection, updateDoc, deleteDoc, query, where } from "firebase/firestore"; 

const AuthContext = React.createContext()
const auth = getAuth(app)

export function useAuth() {
  return useContext( AuthContext )
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [currentUserAdmin, setCurrentUserAdmin] = useState(false)
  const [currentUserName, setCurrentUserName] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  async function createUserDoc(userId, userRole, name, email) {
    return await setDoc(doc(firestore, "users", userId), {
      name : name,
      role: userRole,
      email : email
    }).catch(err => {
      console.log(err.message)
    })
  }

  async function getUserRole(id) {
    const docRef = doc(firestore, "users", id)
    let userData = await getDoc(docRef)
    if (userData.exists()) {
      let userRole = userData.data().role
      return userRole
    } else {
      return null
    }
  }

  async function getUsersList() {
    const querySnapshot  = await getDocs(collection(firestore, "users"))
    let data = [];
    querySnapshot.forEach((doc) => {
      let user = {id: doc.id, ...doc.data()}
      data.push(user)
    });
    return data
  }

  async function getUserNameById(id) {
    const docRef = doc(firestore, "users", id)
    let userData = await getDoc(docRef)

    if (userData.exists()) {
      let userName = userData.data().name
      return userName
    } else {
      return null
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function updateUserName(name) {
    return updateDoc(doc(firestore, "users", currentUser.uid), {
      name : name
    }).catch(e => {
      console.log(e)
    })
  }

  function updateUserEmail(email) {
    return updateEmail(auth.currentUser, email)
    .then(() => {
      updateDoc(doc(firestore, "users", currentUser.uid), {
        email : email
      })
    })
    .catch((e)=> {
      console.log(e)
    })
  }

  function updateUserPassword(password) {
    return updatePassword(auth.currentUser, password)
  }

  function updateUserRole(role) {
    return updateDoc(doc(firestore, "users", currentUser.uid), {
      role : role
    }).catch(e => {
      console.log(e)
    })
  }

  async function updateTasksAfterUserDelete(uid) {
    const q = query(collection(firestore, "tasks"), where("assignedUserId", "==", uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((task) => {
      updateDoc(doc(firestore, "tasks", task.id), {
        assignedUserId : 0
      }).catch(e => {
        console.log(e)
      })
    });

    return querySnapshot
  }

  function deleteUserAccount(password) {
    let email = currentUser.email;
    let credential = EmailAuthProvider.credential(email, password)
    let uid = currentUser.uid
    
    return reauthenticateWithCredential(auth.currentUser, credential)
    .then(()=> {
      deleteUser(auth.currentUser)
    })
    .then(() => {
      deleteDoc(doc(firestore, "users", uid))
    })
    .then(()=> {
      updateTasksAfterUserDelete(uid)
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      if(user) {
        getUserRole(user.uid).then(role => {
          if(role === 'admin') {
            setCurrentUserAdmin(true)
          }
        })

        getUserNameById(user.uid).then(name => {
          setCurrentUserName(name)
        })
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    currentUserAdmin,
    currentUserName,
    signup,
    login,
    logout,
    resetPassword,
    updateUserName,
    updateUserEmail,
    updateUserPassword,
    updateUserRole,
    createUserDoc,
    getUserRole,
    getUsersList,
    getUserNameById,
    deleteUserAccount
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
