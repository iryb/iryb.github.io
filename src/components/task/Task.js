import React, { useState, useRef } from 'react'
import { Button, Modal, Alert, Badge, Form } from 'react-bootstrap'
import { useTasks } from '../../contexts/TasksContext'
import { BsTrash, BsPencil } from "react-icons/bs"
import EditTaskModal from '@components/EditTaskModal'
import UserAvatar from "@components/user-avatar/UserAvatar";
import styles from './styles.module.scss';
import clsx from "clsx";
import { useDispatch } from 'react-redux';
import { addComment } from '@store/tasksSlice';


export default function Task({show, showTaskDetails, item, color, closeTask}) {
  const { 
    assignedUser, assigneePhotoURL, 
    status, title, content } = item;

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showEditTask, setShowEditTask] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false)
  const {deleteTask} = useTasks()
  const [textareaFocused, setTextareaFocused] = useState(false);
  const commentRef = useRef();
  const dispatch = useDispatch();

  function handleClose() {
    closeTask()
  }

  function handleEditTask() {
    closeTask()
    // handleUpdateTasks()
    setShowEditTask(!showEditTask)
  }

  function handleOpenDelete() {
    showTaskDetails()
    setDeleteModal(!deleteModal)
  }

  async function handleDeleteTask() {
    await deleteTask(item.id).then(() => {
      handleCloseDelete()
      // handleUpdateTasks()
      setMessage(`Task ${item.title} was sucessfully deleted.`)
    }).catch(()=> {
      setError('Failed to delete the task.')
    })
  }

  function handleCloseDelete() {
    setDeleteModal(!deleteModal)
  }

  const handleSubmitComment = () => {
    if(commentRef.current.value) {
      dispatch(addComment({
        text: commentRef.current.value
      }));
    }
  }

  const handleFocus = (e) => {
    e.target.style.minHeight = "100px";
    e.target.style.marginBottom = "15px";
    setTextareaFocused(true);
  }

  const handleBlur = (e) => {
    e.target.style.minHeight = "0";
    setTextareaFocused(false);
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
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
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <div className={styles.cardBody}>
          <div className="task position-relative" bg="light">
              <div className={styles.taskInner}>
                <div className={clsx(styles.taskControls, "task-footer d-flex")}>
                  <Button variant="link btn-icon me-2" onClick={handleOpenDelete}><BsTrash /></Button>
                  <Button variant="link btn-icon" onClick={handleEditTask}><BsPencil /></Button>
                </div>
                <div className={styles.taskDescription}>{content}</div>
                <div className={styles.taskInfo}>
                  <div className={styles.title}>Status:</div>
                  <div className={styles.info}>
                    <Badge bg={color} className="item-status mb-2">{status}</Badge>
                  </div>
                  <div className={styles.title}>Assignee:</div>
                  <div className={clsx(styles.info, styles.userInfo)}>
                    {assignedUser ? 
                    <>
                      <UserAvatar userName={assignedUser} photo={assigneePhotoURL} className={styles.avatar} />
                      <span>{assignedUser}</span>
                    </>
                    : <span>No one is assigned</span>}
                  </div>
                  <div className={styles.title}>Due date:</div>
                  <div className={styles.info}>No due date</div>
                </div>
              </div>
              <div className={styles.commentsBlock}>
                <Form onSubmit={handleSubmitComment}>
                  <Form.Group>
                    <Form.Control as="textarea" placeholder="Ask a question or post an update..." 
                    ref={commentRef} onFocus={handleFocus} onBlur={handleBlur} className={styles.textareaExpandable} />
                  </Form.Group>
                  {textareaFocused && <Button variant="primary" type="submit">
                    Send
                  </Button>}
                </Form>
              </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
