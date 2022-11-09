import React, {useRef, useState} from 'react';
import { Button, Modal, Form, Alert} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsers } from '@store/userSlice';
import { addNewTask } from '@store/tasksSlice';
import styles from './styles.module.scss';
import { v4 as uuidv4 } from 'uuid';

export default function AddTaskModal({show, setShowModal}) {
  const titleRef = useRef();
  const descRef = useRef();
  const userRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filesPreview, setFilesPreview] = useState([]);

  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
  
  const handleClose = () => {
    setShowModal();
  }

  const handleChangeFiles = (e) => {
    if(e.target.files) {
      setFilesPreview([]);
      const files = Array.from(e.target.files);
      console.log(files);
      files.forEach(file => setFilesPreview([...filesPreview, URL.createObjectURL(file)]))
    }
  }

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let title = titleRef.current.value;
    let desc = descRef.current.value;
    let user = 0;

    if(userRef.current.value) {
      user = userRef.current.value;
    }
    if(title) {
      dispatch(addNewTask({
        content: desc,
        title,
        user
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
              <Form.Label>Attachments</Form.Label>
              {filesPreview && filesPreview.map(file => {
              return <div className={styles.previewWrapper} key={uuidv4()}>
                <img src={file} alt="Preview" />
              </div>})}
              
              <Form.Control type="file" accept="*" multiple="multiple" onChange={handleChangeFiles}/>
            </Form.Group>
            <Form.Group className="mb-3" id="user">
              <Form.Label>Assign user</Form.Label>
              <Form.Select ref={userRef}>
                {users.map( user => {
                  return <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
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
