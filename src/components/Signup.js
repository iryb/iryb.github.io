import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const roleRef = useRef()
  const { signup, createUserDoc } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

     try {
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
        .then(registeredUser => {
          createUserDoc(registeredUser.user.uid, roleRef.current.value, nameRef.current.value, emailRef.current.value)
        })
        .then(()=>{
          setLoading(false)
          navigate('/')
        })
        .catch(error=> {
          const errorCode  = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            setError('The password is too weak.');
          } else {
            setError(errorMessage);
          }
        })
    } catch(err) {
      console.log(err.message)
      setError('Failed to create an account')
    }
  }

  return (
    <div className="card-container mx-auto">
      <Card>
        <Card.Body>
          <h2 className="text-center">Sign Up</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" ref={nameRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" ref={emailRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="password-confirm">
              <Form.Label>Confirm your Password</Form.Label>
              <Form.Control type="password" placeholder="Password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Form.Group className="mb-3" id="role">
              <Form.Label>Role</Form.Label>
              <Form.Select ref={roleRef}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Form.Select>
            </Form.Group>
            <Button disabled={loading} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  )
}
