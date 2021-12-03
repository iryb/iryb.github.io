import React, { useContext, useState, useEffect } from 'react'
import { firestore } from '../firebase'
import { addDoc, getDocs, updateDoc, deleteDoc, doc, collection } from "firebase/firestore"; 

const TasksContext = React.createContext()

export function useTasks() {
  return useContext( TasksContext )
}

export default function TasksProvider({ children }) {
  const [tasks, setTasks] = useState()
  const [loading, setLoading] = useState(true)

  async function getTasks() {
    const querySnapshot  = await getDocs(collection(firestore, "tasks"))
    let data = [];
    querySnapshot.forEach((doc) => {
      let task = {id: doc.id, ...doc.data()}
      data.push(task)
    });
    setTasks(data)
    return data
  }

  function setStatus(taskId, status) {
    const tasksDoc = doc(firestore, "tasks", taskId)

    updateDoc(tasksDoc, {
      status: status
    }).catch(err => {
      console.log(err.message)
    })

    getTasks().then((data) => {
      setTasks(data)
      setLoading(false)
    })

    return tasks
  }

  function addTask(content, title, user) {
    return addDoc(collection(firestore, "tasks"), {
      assignedUserId: user,
      content : content,
      title : title,
      status : "to do"
    }).catch(e => {
      console.log(e)
    })
  }

  function updateTask(taskId, content, title, user) {
    return updateDoc(doc(firestore, "tasks", taskId), {
      assignedUserId: user,
      content : content,
      title : title
    }).catch(e => {
      console.log(e)
    })
  }

  function deleteTask(taskId) {
    return deleteDoc(doc(firestore, "tasks", taskId))
  }

  useEffect(()=> {
    getTasks().then(() => {
      setLoading(false)
    })
  }, [])

  const value = {
    tasks,
    getTasks,
    setStatus,
    addTask,
    updateTask,
    deleteTask
  }

  return (
    <TasksContext.Provider value={value}>
      {!loading && children}
    </TasksContext.Provider>
  )
}
