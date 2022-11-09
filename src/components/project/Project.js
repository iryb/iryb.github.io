import React, { useState, useEffect } from 'react'
import { Row, Button } from 'react-bootstrap'
import Column from '../Column'
import TaskCard from '@components/task-card/TaskCard';
import { statuses } from '../../data/index'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"
import {useTasks} from '../../contexts/TasksContext'
import AddTaskModal from '../AddTaskModal' 
import Task from '../Task'
import { AiOutlinePlusSquare } from "react-icons/ai"
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@store/userSlice';
import { setTasks, selectTasks } from '@store/tasksSlice';
import Login from '@components/sign/Login'
import { InnerPageContainer } from '@components/inner-page-container/InnerPageContainer'

export default function Project() {
  // const { getUserNameById } = useAuth()
  const { 
    // tasks, 
    setStatus } = useTasks() 
  // const [loading, setLoading] = useState(false)

  const currentTasks = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTasks());
  }, []);


  const onDrop = (item, monitor, status) => {
    setStatus(item, status)
    // handleUpdateTasks()
  };

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [openedTask, setOpenedTask] = useState();
  // const [assignedUser, setAssignedUser] = useState();
  const [openedTaskStatus, setOpenedTaskStatus] = useState();

  const handleAddModalShow = () => {
    setShowAddTaskModal(!showAddTaskModal)
  }

  // const handleUpdateTasks = () => {
  //   getTasks().then((items) => {
  //     setCurrentTasks(items)
  //   })
  // }

  const handleOpenTask = (e) => {
    if(e) {
      let taskId = e.target.parentNode.getAttribute("data-id")
      let task = currentTasks.find(item => item.id === taskId)
      if(task.assignedUserId) {
        // getUserNameById(task.assignedUserId).then((user) => {
        //   setAssignedUser(user)
        // })
      }

      let status = statuses.find(item => item.status === task.status)
      setOpenedTaskStatus(status.color)
      setOpenedTask(task)
    }
    setShowTaskDetails(!showTaskDetails)
  }

  const handleCloseTask = () => {
    setShowTaskDetails(false)
  }

  if (!user) return <Login />;

  return (
    <InnerPageContainer>
      <h1 className="h3 mb-4">Awesome project</h1>
      {/* {!loading && <> */}
        <AddTaskModal show={showAddTaskModal} setShowModal={handleAddModalShow} 
        // updateTasks={handleUpdateTasks}
        />
        <Task show={showTaskDetails} 
          showTaskDetails={handleOpenTask} 
          closeTask={handleCloseTask}
          item={openedTask} 
          // assignedUser={assignedUser} 
          // handleUpdateTasks={handleUpdateTasks}
          color={openedTaskStatus}
          // admin={userAdmin}
        />
        <Row className="mt-4">
          <DndProvider backend={HTML5Backend}>
            {statuses.map((s) => {
              return (
                <Column onDrop={onDrop} status={s.status} key={s.id}>
                  <Button variant="link" className="btn-icon btn-add" onClick={handleAddModalShow}><AiOutlinePlusSquare /></Button>
                  <h3 className="h5 col-header text-center pb-1">{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</h3>
                  {currentTasks
                    .filter(i => i.status === s.status)
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
      {/* </>} */}
    </InnerPageContainer>
  )
}
