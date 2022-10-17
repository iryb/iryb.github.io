import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { login } from "../store/userSlice";
import { useDispatch } from 'react-redux';

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const handleLogin = (e) => {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then(user => {
        dispatch(login({
          email: user.email,
          uid: user.uid,
          name: user.name,
        }));
        console.log('login');
      })
      .then(() => navigate('/'));
    } catch {
      setError('Failed to log in')
    }

    setLoading(false)
  }

  return (
    <div className="card-container mx-auto">
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-center">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" id="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" ref={emailRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} variant="primary" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}
