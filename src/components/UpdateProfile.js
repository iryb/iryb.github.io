import React, {useRef, useState, useEffect} from 'react'
import {Form, Button, Card, Alert, Modal} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function UpdateProfile() {
  const relogPasswordRef = useRef()
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const roleRef = useRef()
  const { currentUser, currentUserAdmin, currentUserName, getUserRole, getUserNameById, updateUserName, updateUserPassword, updateUserEmail, updateUserRole, deleteUserAccount } = useAuth()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(currentUserAdmin ? 'admin' : 'user')
  const [userName, setUserName] = useState(currentUserName)
  const [deleteModal, setDeleteModal] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    const promises = []
    setError('')
    setMessage('')
    setLoading(true)

    if(nameRef.current.value !== userName) {
      promises.push(updateUserName(nameRef.current.value))
    }
    if(emailRef.current.value !== currentUser.email) {
      promises.push(updateUserEmail(emailRef.current.value))
    }
    if(passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value))
    }
    if(roleRef.current.value !== userRole) {
      promises.push(updateUserRole(roleRef.current.value))
    }

    Promise.all(promises)
    .then(()=> {
      setMessage('Your profile was updated.')
      navigate('/')
    }).catch(()=> {
      setError('Failed to update an account')
    })
  }

  async function handleUserDelete(e) {
    e.preventDefault()
    setError('')
    if(relogPasswordRef.current.value) {
      try {
        await deleteUserAccount(relogPasswordRef.current.value)
        .then(() => {
          navigate('/')
        }).catch((e) =>{
          const errorMessage = e.message;
          console.log(e)
          handleCloseDelete()
          setError('Failed to delete account : ' + errorMessage)
        })
      } catch (e) {
        console.log(e)
        handleCloseDelete()
        setError('Failed to delete account')
      }
    }
  }

  function handleCloseDelete() {
    setDeleteModal(!deleteModal)
  }

  useEffect(() => {
    setLoading(true)
    getUserNameById(currentUser.uid).then(name => {
      setUserName(name)
    })
    getUserRole(currentUser.uid).then(role => {
      setUserRole(role)
    }).then(()=> {
      setLoading(false)
    })
  }, [])

  return (
    <div className="card-container mx-auto">
      {!loading && <>
        <Modal className="text-center" show={deleteModal} onHide={handleCloseDelete}>
          <Modal.Body>
            <p>Are you sure you want to delete your account?</p>
            <Form onSubmit={handleUserDelete}>
              <Form.Group className="mb-3" id="relogPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={relogPasswordRef} placeholder="Please enter your password" />
              </Form.Group>
              <Button variant="primary mb-2" type="submit">Delete</Button>
            </Form>
            <Button variant="primary" onClick={handleCloseDelete}>Cancel</Button>
          </Modal.Body>
        </Modal>
        <Card className="mt-4">
          <Card.Body>
            <h2 className="text-center">Update profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="sucess">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" ref={nameRef} defaultValue={userName} />
              </Form.Group>
              <Form.Group className="mb-3" id="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" ref={emailRef} defaultValue={currentUser.email} />
              </Form.Group>
              <Form.Group className="mb-3" id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={passwordRef} placeholder="Leave blank to keep the same" />
              </Form.Group>
              <Form.Group className="mb-3" id="password-confirm">
                <Form.Label>Confirm your Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
              </Form.Group>
              <Form.Group className="mb-3" id="role">
                <Form.Label>Role</Form.Label>
                <Form.Select ref={roleRef} defaultValue={userRole}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Form.Select>
              </Form.Group>
              <Button disabled={loading} variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center my-3 d-flex justify-content-center align-items-sm-center">
          <Button variant="link py-0" onClick={handleCloseDelete}>Delete profile</Button>
          <Link to="/">Back to Dashboard</Link>
        </div>
      </>
      }
    </div>
  )
}
