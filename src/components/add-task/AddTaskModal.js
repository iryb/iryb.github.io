import React, {useRef, useState} from 'react';
import { Button, Modal, Form, Alert} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsers } from '@store/userSlice';
import { addNewTask } from '@store/tasksSlice';
import ImagesPreview from "@components/images-preview/ImagesPreview";

export default function AddTaskModal({show, setShowModal}) {
  const titleRef = useRef();
  const descRef = useRef();
  const userRef = useRef();
  const dueDateRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
  
  const handleClose = () => {
    setShowModal();
  }

  const handleFilesSet = (files) => {
    setFiles(files);
  }

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let title = titleRef.current.value;
    let desc = descRef.current.value;
    let user = null;

    if(userRef.current.value) {
      user = userRef.current.value;
    }
    if(title) {
      dispatch(addNewTask({
        content: desc,
        title,
        user,
        attachments: files,
        deadline: dueDateRef.current.value
      }));
    }
  }

  return (
    <>
    {error && <Alert variant="danger">{error}</Alert>}
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
            <Form.Group className="mb-3" id="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" placeholder="Enter description" ref={descRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="attachments">
              <ImagesPreview onFilesSet={handleFilesSet} />
            </Form.Group>
            <Form.Group className="mb-3" id="user">
              <Form.Label>Assigned user</Form.Label>
              <Form.Select ref={userRef}>
                <option value="">No user selected</option>
                {users.map( user => {
                  return <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" id="deadline">
              <Form.Label>Due date:</Form.Label>
              <Form.Control type="datetime-local" name="deadline" ref={dueDateRef} />
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
