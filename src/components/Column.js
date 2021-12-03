import React from "react"
import { useDrop } from 'react-dnd'

const Column = ({onDrop, children, status}) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'TASKCARD',
    drop: (item, monitor) => {
      onDrop(item.id, monitor, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))


  return (
    <div
      ref={drop}
      className="column col-md-3 py-2"
    >
      <div className="p-3 h-100 position-relative" style={{backgroundColor: isOver ? '#ffff9494' : 'rgb(197 237 255 / 44%)' }}>
        {children}
        {canDrop ? 'Release to drop' : ''}
      </div>
    </div>
  )
}

export default Column;