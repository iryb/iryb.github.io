import React, {useRef, useState} from 'react'
import {Form, Button, Alert, Row, Col} from 'react-bootstrap'
import { InnerPageContainer } from '@components/inner-page-container/InnerPageContainer';
import { selectUser, updateProfile } from '@store/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import DeleteProfile from '../delete-profile/DeleteProfile';
import styles from './styles.module.scss';

export default function UpdateProfile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const avatarRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const roleRef = useRef();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.photoURL);
  const [avatarFile, setAvatarFile] = useState();

  function handleSubmit(e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    setError('')
    setMessage('')
    setLoading(true)

    dispatch(updateProfile({ 
      name: (nameRef.current.value !== user.name) && nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      role: (roleRef.current.value !== user.role) && roleRef.current.value,
      photo: avatarRef.current.value ? avatarFile : null
    }))
      .unwrap()
      .then(() => setMessage('Profile was updated successfully'))
      .catch((e) => setError(e.message));
      setLoading(false);
  }

  const handleCloseDelete = () => setDeleteModal(!deleteModal);

  const handleChangeAvatar = (e) => {
    if(e.target.files[0]) {
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
      setAvatarFile(e.target.files[0]);
    }
  }

  return (
    <InnerPageContainer>
      <div className={styles.cardContainer}>
        {!loading && <>
          <DeleteProfile show={deleteModal} onHide={handleCloseDelete} />
          <h2 className="mb-4">Update profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="sucess">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" id="avatar">
              <div className={styles.avatarWrapper}>
                <img src={avatarPreview} alt="Your avatar" />
              </div>
              <Form.Control type="file" accept="image/*" ref={avatarRef} className={styles.avatarInput} 
              onChange={handleChangeAvatar} />
            </Form.Group>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" id="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" ref={nameRef} defaultValue={user.displayName} className="inputRound" />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" id="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" ref={emailRef} defaultValue={user.email} className="inputRound" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" ref={passwordRef} placeholder="Leave blank to keep the same" className="inputRound" />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" id="password-confirm">
                  <Form.Label>Confirm your Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm Password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" className="inputRound" />
                </Form.Group>
              </Col>
            </Row>
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
