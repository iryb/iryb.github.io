import React, { useState } from 'react'
import { Button, Modal, Alert, Badge } from 'react-bootstrap'
import { BsTrash, BsPencil } from "react-icons/bs"
import EditTaskModal from '@components/edit-task/EditTaskModal';
import UserAvatar from "@components/user-avatar/UserAvatar";
import Comments from "@components/comments/Comments";
import styles from './styles.module.scss';
import clsx from "clsx";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { removeTask } from '@store/tasksSlice';


export default function Task({show, showTaskDetails, item, color, closeTask}) {
  const { id, assignedUser, assigneePhotoURL, 
    status, title, content, deadline, attachments, createdAt, updatedAt } = item;

  const [error, setError] = useState('');
  const [showEditTask, setShowEditTask] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch();

  function handleClose() {
    closeTask()
  }

  function handleEditTask() {
    closeTask()
    setShowEditTask(!showEditTask)
  }

  function handleOpenDelete() {
    showTaskDetails()
    setDeleteModal(!deleteModal)
  }

  async function handleDeleteTask() {
    dispatch(removeTask({ taskId: id }))
    .then(() => handleCloseDelete())
    .catch((e) => setError(e));
  }

  function handleCloseDelete() {
    setDeleteModal(!deleteModal)
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
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
                {attachments && <div className={styles.taskAttachments}>
                  {attachments.map(file => <a key={uuidv4()} href={file} target="blank">
                      <img src={file} alt="file" />
                    </a>)}
                </div>}
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
                  <div className={styles.info}>{deadline ? deadline : "No due date"}</div>
                  <div className={styles.title}>Created:</div>
                  <div className={styles.info}>{createdAt}</div>
                  <div className={styles.title}>Updated:</div>
                  <div className={styles.info}>{updatedAt}</div>
                </div>
              </div>
              <div className={styles.commentsBlock}>
                <Comments taskId={id} />
              </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
