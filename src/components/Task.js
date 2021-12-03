import React, { useState} from 'react'
import { Button, Modal, Alert, Badge} from 'react-bootstrap'
import { useTasks } from '../contexts/TasksContext'
import { BsTrash, BsPencil } from "react-icons/bs"
import EditTaskModal from './EditTaskModal'


export default function Task({show, showTaskDetails, item, color, assignedUser, handleUpdateTasks, closeTask, admin}) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showEditTask, setShowEditTask] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false)
  const {deleteTask} = useTasks()

  function handleClose() {
    closeTask()
  }

  function handleEditTask() {
    closeTask()
    handleUpdateTasks()
    setShowEditTask(!showEditTask)
  }

  function handleOpenDelete() {
    showTaskDetails()
    setDeleteModal(!deleteModal)
  }

  async function handleDeleteTask() {
    await deleteTask(item.id).then(() => {
      handleCloseDelete()
      handleUpdateTasks()
      setMessage(`Task ${item.title} was sucessfully deleted.`)
    }).catch(()=> {
      setError('Failed to delete the task.')
    })
  }

  function handleCloseDelete() {
    setDeleteModal(!deleteModal)
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      {item && <>
        <EditTaskModal show={showEditTask} showEditTask={handleEditTask} item={item}/>
        <Modal show={deleteModal} onHide={handleCloseDelete}>
          <Modal.Body>
            <p>Are you sure you want to delete the task <b>{item.title}</b>?</p>
            <Button variant="primary me-2" onClick={handleDeleteTask}>Delete</Button>
            <Button variant="primary" onClick={handleCloseDelete}>Cancel</Button>
          </Modal.Body>
        </Modal>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{item.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="task mb-2 position-relative" bg="light">
                <Badge bg={color} className="item-status mb-2">{item.status}</Badge>
                <div className="item-text">{item.content}</div>
                {assignedUser && <div className="assigned"><b>Assignee:</b> {assignedUser}</div> }
                 {admin && <div className="task-footer d-flex pt-2">
                  <Button variant="link btn-icon me-2" onClick={handleOpenDelete}><BsTrash /></Button>
                  <Button variant="link btn-icon" onClick={handleEditTask}><BsPencil /></Button>
                </div>}
            </div>
          </Modal.Body>
        </Modal>
      </>}
    </>
  );
}
