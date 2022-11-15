import React from 'react';
import styles from './styles.module.scss';
import { formatDateShort } from "@helpers/helpers";
import Badge from 'react-bootstrap/Badge';
import UserAvatar from "@components/user-avatar/UserAvatar";
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { setOpenedTask } from '@store/tasksSlice';
import { useNavigate } from 'react-router-dom';

export default function TaskListItem({ task }) {
  const { id, assignedUser, assigneePhotoURL, status, title, deadline } = task;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTaskClick = (e) => {
    e.preventDefault();
    dispatch(setOpenedTask({ id }));
    navigate("/project");
  }

  return (
    <div className={clsx("shadow p-3 mb-3", styles.taskListItem)} onClick={handleTaskClick}>
      <div className={styles.taskInfo}>
        {deadline && <div className={styles.deadline}>
        Due: {formatDateShort(deadline)}
        </div>}
        <Badge className={styles.status}>{status}</Badge>
      </div>
      {assignedUser &&
        <UserAvatar userName={assignedUser} photo={assigneePhotoURL} className={styles.avatar} />}
      <h5 className={styles.title}>{ title }</h5>
    </div>
  );
}