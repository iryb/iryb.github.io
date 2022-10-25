import React, {useRef, useState} from 'react'
import {Form, Button, Alert} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { InnerPageContainer } from '@components/inner-page-container/InnerPageContainer';
import { selectUser } from '@store/userSlice';
import { useSelector } from 'react-redux';
import DeleteProfile from '../delete-profile/DeleteProfile';

export default function UpdateProfile() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const roleRef = useRef()
  const { 
    //currentUser, 
    // currentUserAdmin, currentUserName, getUserRole, getUserNameById, 
    updateUserName, updateUserPassword, updateUserEmail, updateUserRole } = useAuth()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  // const [userRole, setUserRole] = useState(currentUserAdmin ? 'admin' : 'user')
  // const [userName, setUserName] = useState(currentUserName)
  const [deleteModal, setDeleteModal] = useState(false)

  const user = useSelector(selectUser);

  function handleSubmit(e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    const promises = []
    setError('')
    setMessage('')
    setLoading(true)

    if(nameRef.current.value !== user.name) {
      promises.push(updateUserName(nameRef.current.value))
    }
    if(emailRef.current.value !== user.email) {
      promises.push(updateUserEmail(emailRef.current.value))
    }
    if(passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value))
    }
    if(roleRef.current.value !== user.role) {
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

  const handleCloseDelete = () => setDeleteModal(!deleteModal);

  // useEffect(() => {
  //   setLoading(true)
  //   getUserNameById(currentUser.uid).then(name => {
  //     setUserName(name)
  //   })
  //   getUserRole(currentUser.uid).then(role => {
  //     setUserRole(role)
  //   }).then(()=> {
  //     setLoading(false)
  //   })
  // }, [])

  return (
    <InnerPageContainer>
      <div className="card-container">
        {!loading && <>
          <DeleteProfile show={deleteModal} onHide={handleCloseDelete} />
          <h2 className="mb-4">Update profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="sucess">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" ref={nameRef} defaultValue={user.displayName} className="inputRound" />
            </Form.Group>
            <Form.Group className="mb-3" id="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" ref={emailRef} defaultValue={user.email} className="inputRound" />
            </Form.Group>
            <Form.Group className="mb-3" id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" ref={passwordRef} placeholder="Leave blank to keep the same" className="inputRound" />
            </Form.Group>
            <Form.Group className="mb-3" id="password-confirm">
              <Form.Label>Confirm your Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm Password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" className="inputRound" />
            </Form.Group>
            <Form.Group className="mb-3" id="role">
              <Form.Label>Role</Form.Label>
              <Form.Select ref={roleRef} defaultValue={user.role} className="selectRound">
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Form.Select>
            </Form.Group>
            <Button disabled={loading} variant="primary" type="submit" className="btnRound">
              Save
            </Button>
          </Form>
          <hr />
          <div className="w-100 my-3 d-flex align-items-sm-center">
            <Button variant="danger" onClick={handleCloseDelete} className="btnRound">Delete profile</Button>
          </div>
        </>
        }
      </div>
    </InnerPageContainer>
  )
}
