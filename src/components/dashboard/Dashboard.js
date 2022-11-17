import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '@store/userSlice'
import { InnerPageContainer } from '@components/inner-page-container/InnerPageContainer';
import { selectTasks } from '@store/tasksSlice';
import { v4 as uuidv4 } from 'uuid';
import TaskListItem from '@components/task-list-item/TaskListItem';
import Login from "@components/sign/Login";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const user = useSelector(selectUser);
  const currentTasks = useSelector(selectTasks);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const tasks = currentTasks.filter(t => (t.assignedUserId === user.id) && (t.status !== "done"));
      setUpcoming(tasks);
      setLoading(false);
    }
  }, [currentTasks]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const tasks = currentTasks.filter(t => (t.assignedUserId === user.id) && (t.status === "done"));
      setCompleted(tasks);
      setLoading(false);
    }
  }, [currentTasks]);

  if (user === null) return <Login />;

  return (
    <InnerPageContainer>
      <h1 className="h3 mb-4">Dashboard</h1>
      {loading && <h4>Loading...</h4>}
      {!loading && <>
        <h4 className="mb-3">Upcoming tasks</h4>
        {upcoming?.length > 0 ? upcoming.map(t => <TaskListItem key={uuidv4()} task={t} />)
        : <p>No upcoming tasks</p>
        }
        <h4 className="mb-3">Completed tasks</h4>
        {completed?.length > 0 ? completed.map(t => <TaskListItem key={uuidv4()} task={t} />)
        : <p>No completed tasks</p>
        }
      </>}
    </InnerPageContainer>
  )
}
