import React, {useRef, useState, useEffect} from 'react'
import { Button, Modal, Form, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../contexts/TasksContext'

export default function AddTaskModal({show, setShowModal, updateTasks}) {
  const titleRef = useRef()
  const contentRef = useRef()
  const userRef = useRef()
  const { getUsersList } = useAuth()
  const [users, setUsers] = useState()
  const [loading, setLoading] = useState(true)
  const { addTask } = useTasks()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getUsersList().then((data) => {
      setUsers(data)
      setLoading(false)
    })
  }, [])
  
  function handleClose() {
    setShowModal()
  }

  function handleSave(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    let title = titleRef.current.value
    let content = contentRef.current.value
    let user = 0

    if(userRef.current.value) {
      user = userRef.current.value
    }
    if(content && title) {
      addTask(content, title, user).then(() => {
        setMessage('Task was added to dashboard.')
        updateTasks()
        setShowModal()
      })
    }
  }

  return (
    <>
    {error && <Alert variant="danger">{error}</Alert>}
    {message && <Alert variant="success">{message}</Alert>}
    {!loading &&
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" id="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" ref={titleRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="content">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" placeholder="Enter content" ref={contentRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="user">
              <Form.Label>Assign user</Form.Label>
              <Form.Select ref={userRef}>
                {users.map( user => {
                  return <option key={user.id} value={user.id}>{user.name}</option>
                })}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      }
    </>
  );
}
