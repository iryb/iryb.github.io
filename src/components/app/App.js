import React, {useEffect} from "react";
import Signup from "@components/sign/Signup";
import Login from "@components/sign/Login";
import AuthProvider from "../../contexts/AuthContext";
import TasksProvider from '../../contexts/TasksContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "../Dashboard";
import Project from "@components/project/Project";
import ForgotPassword from "@components/sign/ForgotPassword";
import UpdateProfile from "../profile/UpdateProfile";
import PrivateRoute from "../PrivateRoute";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from 'react-redux';
import { setUser } from "../../store/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Tasks Dashboard"
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(setUser({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      }
    })
  }, []);

  return (
    <Router>
      <AuthProvider>
        <TasksProvider>
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
        </TasksProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
