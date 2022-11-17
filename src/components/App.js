import React, {useEffect} from "react";
import Signup from "@components/sign/Signup";
import Login from "@components/sign/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "@components/dashboard/Dashboard";
import Project from "@components/project/Project";
import ForgotPassword from "@components/sign/ForgotPassword";
import UpdateProfile from "@components/profile/UpdateProfile";
import PrivateRoute from "@components/PrivateRoute";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from 'react-redux';
import { setUser, setUserRole } from "@store/userSlice";
import { setTasks } from '@store/tasksSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Tasks Dashboard"
  }, []);

  useEffect(() => {
    dispatch(setTasks());
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(setUser({
          id: auth.currentUser.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
        dispatch(setUserRole());
      }
    })
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Dashboard/>} />
        <Route exact path="/project" element={<Project />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/update-profile" element={
          <PrivateRoute>
            <UpdateProfile/>
          </PrivateRoute>
        }>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
