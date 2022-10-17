import React, {useEffect} from "react"
import Signup from "./Signup"
import { Container } from 'react-bootstrap'
import AuthProvider from "../contexts/AuthContext"
import TasksProvider from '../contexts/TasksContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from "./Dashboard"
import Login from "./Login";
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import PrivateRoute from "./PrivateRoute"
import Header from "./Header"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from 'react-redux';
import { login, logout } from "../store/userSlice";

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
          name: user.name,
        }));
        console.log('app-js');
      } else {
        dispatch(logout());
      }
    })
  }, []);

  return (
    <Container>
      <Router>
        <AuthProvider>
          <Header />
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
    </Container>
  );
}

export default App;
