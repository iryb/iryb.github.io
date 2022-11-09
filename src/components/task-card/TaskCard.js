import React from 'react';
import { useDrag } from 'react-dnd'
import { Card } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import styles from './styles.module.scss';
import clsx from 'clsx';

export default function TaskCard({ item, index, color, isDraggable }) {
  const { id, assignedUser, assigneePhotoURL, status, title } = item;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASKCARD',
    item: { id : index, ...item },
    canDrag: () => {
      return isDraggable
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }))
  
  return (
    <Card className={clsx(styles.taskCard, "task-card mb-2 position-relative")} ref={drag} data-id={id} bg="light" style={{ opacity: isDragging ? 0.5 : 1}}>
      <Card.Body className="py-4">
        {assignedUser && <div className={styles.assignee}>
          {assigneePhotoURL && 
            <img src={assigneePhotoURL} alt={assignedUser} title={assignedUser} />}
          {!assigneePhotoURL && 
            <span>{assignedUser.charAt(0)}</span>}
        </div>}
        <Badge bg={color} className="item-status position-absolute top-0 end-0">{status}</Badge>
        <Card.Title className="item-title mb-0 h6 transition-300">{title}</Card.Title>
      </Card.Body>
    </Card>
  )
}
