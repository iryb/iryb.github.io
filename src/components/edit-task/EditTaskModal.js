import React, {useRef, useState} from 'react'
import { Button, Modal, Form, Alert} from 'react-bootstrap'
import ImagesPreview from "@components/images-preview/ImagesPreview";
import { useSelector, useDispatch } from 'react-redux';
import { selectUsers } from '@store/userSlice';
import { updateTask } from '@store/tasksSlice';

export default function EditTaskModal({ show, showEditTask, item }) {
  const { id, title, content, assignedUserId, deadline, attachments } = item;
  const titleRef = useRef()
  const contentRef = useRef()
  const userRef = useRef()
  const dueDateRef = useRef();
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [files, setFiles] = useState([]);
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();

  function handleClose() {
    showEditTask()
  }

  const handleSave = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if(title) {
      dispatch(updateTask({
        id,
        content: contentRef.current.value,
        title: titleRef.current.value,
        user: userRef.current.value? userRef.current.value : null,
        attachments: files,
        deadline: dueDateRef.current.value
      }))
      .then(() => {
        setMessage(`Task ${title} was successfully updated.`)
      }).catch(()=> {
        setError('Failed to upade the task.')
      });
    }
  }

  const handleFilesSet = (files) => {
    setFiles(files);
  }

  return (
    <>
    {item &&
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task: {item.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" id="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" ref={titleRef} defaultValue={title} required />
            </Form.Group>
            <Form.Group className="mb-3" id="content">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" placeholder="Enter description" ref={contentRef} defaultValue={content} required />
            </Form.Group>
            <Form.Group className="mb-3" id="attachments">
              <ImagesPreview onFilesSet={handleFilesSet} attachments={attachments} />
            </Form.Group>
            <Form.Group className="mb-3" id="user">
              <Form.Label>Assigned user</Form.Label>
              <Form.Select ref={userRef} defaultValue={assignedUserId}>
                <option value="">No user selected</option>
                {users.map( user => {
                  return <option key={user.id} value={user.id}>{user.name}</option>
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" id="deadline">
              <Form.Label>Due date:</Form.Label>
              <Form.Control type="date" name="deadline" defaultValue={deadline} ref={dueDateRef} />
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
