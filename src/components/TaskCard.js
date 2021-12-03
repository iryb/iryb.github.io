import React, {useState} from 'react'
import { useDrag } from 'react-dnd'
import { Card } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import { useAuth } from '../contexts/AuthContext'

export default function TaskCard({ item, index, color, isDraggable }) {
  const [assignedUser, setAssignedUser] = useState()
  const {getUserNameById} = useAuth()

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

  if(item.assignedUserId) {
    getUserNameById(item.assignedUserId).then((user) => {
      setAssignedUser(user)
    })
  }
  
  
  return (
    <Card className="task-card mb-2 position-relative" ref={drag} data-id={item.id} bg="light" style={{ opacity: isDragging ? 0.5 : 1}}>
      <Card.Body className="py-4">
        {assignedUser && <Badge bg="secondary" className="assignee position-absolute top-0 start-0"><i>{assignedUser}</i></Badge>}
        <Badge bg={color} className="item-status position-absolute top-0 end-0">{item.status}</Badge>
        <Card.Title className="item-title mb-0 h6 transition-300">{item.title}</Card.Title>
      </Card.Body>
    </Card>
  )
}
