import React, {useState, useEffect} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Alert, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Header() {
  const { currentUser, logout } = useAuth()
  const [user, setUser] = useState(currentUser)
  const [error, setError] = useState('')

  useEffect(()=> {
    setUser(currentUser)
  })

  function handleLogout() {
    setError('')
    try {
      logout().then(() => {
        window.location.reload()
      })
      setUser(false)
    } catch {
      setError('Failed to log out')
    }
  }

  return (
    <>
      <Row className="header align-items-center p-2 mb-4">
        <div className="col-sm-6">
          <h1 className="h2"><Link className="text-decoration-none transition-300" to="/">Tasks Dashboard</Link></h1>
        </div>
        <div className="col-sm-6">
          {user && <p className="mb-0">Welcome, {user.email}! <Button onClick={handleLogout}>Log out</Button> <Link className="transition-300" to="/update-profile">Update profile</Link></p>}
          {!user && <p className="mb-0"><Link className="transition-300" to="/login">Log in</Link> or <Link className="transition-300" to="/signup">Sign up</Link></p>}
        </div>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  )
}
