import React, { useState, useEffect } from 'react'
import { Row, Button } from 'react-bootstrap'
import Column from '../Column'
import TaskCard from '@components/task-card/TaskCard';
import { statuses } from '../../data/index'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"
import AddTaskModal from '@components/add-task/AddTaskModal' 
import Task from '@components/task/Task';
import { AiOutlinePlusSquare } from "react-icons/ai"
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUsers } from '@store/userSlice';
import { selectTasks, selectOpenedTask, setOpenedTask, 
  selectFilterText, searchByText, updateTaskStatus } from '@store/tasksSlice';
import Login from '@components/sign/Login'
import { InnerPageContainer } from '@components/inner-page-container/InnerPageContainer'
import { FaTimes } from "react-icons/fa";
import styles from './styles.module.scss';

export default function Project() {
  const currentTasks = useSelector(selectTasks);
  const openedTaskId = useSelector(selectOpenedTask);
  const user = useSelector(selectUser);
  const filterText = useSelector(selectFilterText);
  const dispatch = useDispatch();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [taskDetails, setTaskDetails] = useState();
  const [openedTaskStatus, setOpenedTaskStatus] = useState();

  useEffect(() => {
    dispatch(setUsers());
  }, []);

  useEffect(() => {
    const task = currentTasks.find(t => t.id === openedTaskId);
    setTaskDetails(task);
    setShowTaskDetails(true);
  }, []);

  const onDrop = (item, monitor, status) => {
    console.log(item);
    dispatch(updateTaskStatus({ taskId: item, status }));
  };

  const handleAddModalShow = () => {
    setShowAddTaskModal(!showAddTaskModal)
  }

  const handleOpenTask = (e) => {
    if(e) {
      let taskId = e.target.parentNode.getAttribute("data-id")
      let task = currentTasks.find(item => item.id === taskId)
      let status = statuses.find(item => item.status === task.status)
      setOpenedTaskStatus(status.color)
      setTaskDetails(task)
    }
    setShowTaskDetails(!showTaskDetails)
  }

  const handleCloseTask = () => {
    setShowTaskDetails(false);
    dispatch(setOpenedTask(null));
  }

  const handleSearchClear = () => {
    dispatch(searchByText(null));
  }

  if (!user) return <Login />;

  return (
    <InnerPageContainer>
      <h1 className="h3 mb-4">Awesome project</h1>
      {filterText &&<div>
        Search results: 
        <div className={styles.searchTerm}>
          {filterText}
          <span className={styles.searchTermClose} onClick={handleSearchClear}>
            <FaTimes />
          </span>
        </div>
      </div>}
      <AddTaskModal show={showAddTaskModal} setShowModal={handleAddModalShow} />
      {taskDetails && <Task show={showTaskDetails} 
        showTaskDetails={handleOpenTask} 
        closeTask={handleCloseTask}
        item={taskDetails} 
        color={openedTaskStatus}
      />}
      <Row className="mt-4">
        <DndProvider backend={HTML5Backend}>
          {statuses.map((s) => {
            return (
              <Column onDrop={onDrop} status={s.status} key={s.id}>
                <Button variant="link" className="btn-icon btn-add" onClick={handleAddModalShow}><AiOutlinePlusSquare /></Button>
                <h3 className="h5 col-header text-center pb-1">{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</h3>
                {currentTasks
                  .filter(i => i.status === s.status)
                  .filter(i => filterText? i.title.toLowerCase().includes(filterText.toLowerCase()) : i)
                  .map((i, idx) => {
                    return <div key={i.id} className="task-container" onClick={handleOpenTask}>
                      {user ? <TaskCard key={i.id} item={i} index={idx} 
                        color={s.color} isDraggable={true} /> : 
                        <TaskCard key={i.id} item={i} index={idx} 
                        color={s.color} isDraggable={false} />
                      }
                    </div>
                  })
                }
              </Column>
              );
          })}
        </DndProvider>
      </Row>
    </InnerPageContainer>
  )
}
