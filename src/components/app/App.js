import React, {useEffect} from "react"
import Signup from "@components/sign/Signup";
import Login from "@components/sign/Login";
import AuthProvider from "../../contexts/AuthContext"
import TasksProvider from '../../contexts/TasksContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from "../Dashboard"
import ForgotPassword from "../ForgotPassword"
import UpdateProfile from "../UpdateProfile"
import PrivateRoute from "../PrivateRoute"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from 'react-redux';
import { login, logout } from "../../store/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Tasks Dashboard"
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(login({
          email: user.email,
          uid: user.uid,
          name: user.displayName,
        }));
        console.log('app-js');
      } else {
        dispatch(logout());
      }
    })
  }, []);

  return (
    <Router>
      <AuthProvider>
        <TasksProvider>
          <Routes>
            <Route exact path="/" element={<Dashboard/>} />
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
