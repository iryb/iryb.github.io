import React, {useRef, useState, useEffect} from 'react'
import { Button, Modal, Form, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../contexts/TasksContext'

export default function EditTaskModal({show, showEditTask, item}) {
  const titleRef = useRef()
  const contentRef = useRef()
  const userRef = useRef()
  const { getUsersList } = useAuth()
  const [users, setUsers] = useState()
  const [loading, setLoading] = useState(true)
  const { updateTask } = useTasks()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    getUsersList().then((data) => {
      setUsers(data)
      setLoading(false)
    })
  }, [])
  

  function handleClose() {
    showEditTask()
  }

  async function handleSave(e) {
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
      await updateTask(item.id, content, title, user).then(() => {
        setMessage(`Task ${item.title} was successfully updated.`)
        showEditTask()
      }).catch(()=> {
        setError('Failed to upade the task.')
      })
    }
  }

  return (
    <>
    {error && <Alert variant="danger">{error}</Alert>}
    {message && <Alert variant="success">{message}</Alert>}
    {item && !loading &&
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task: {item.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" id="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" ref={titleRef} defaultValue={item.title} required />
            </Form.Group>
            <Form.Group className="mb-3" id="content">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" placeholder="Enter content" ref={contentRef} defaultValue={item.content} required />
            </Form.Group>
            <Form.Group className="mb-3" id="user">
              <Form.Label>Assigned user</Form.Label>
              <Form.Select ref={userRef} defaultValue={item.assignedUserId}>
                {users.map( user => {
                  return <option key={user.id} value={user.id}>{user.name}</option>
                })}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      }
    </>
  );
}
