import React from 'react'
import { Button, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../store/userSlice";
import { auth } from "../firebase";
import { selectUser } from "../store/userSlice";

export default function Header() {
  // const [error, setError] = useState('')
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    auth.signOut()
    .then(() => dispatch(logout()));
  }

  return (
    <>
      <div className="py-2 mb-4">
        <Row className="header align-items-center">
          <div className="col-sm-4">
            <h1 className="h2"><Link className="text-decoration-none transition-300" to="/">Tasks Dashboard</Link></h1>
          </div>
          <div className="col-sm-8 header-text">
            {user && <p className="mb-0">Welcome, {user.email}! <Button onClick={handleLogout}>Log out</Button> <Link className="transition-300" to="/update-profile">Update profile</Link></p>}
            {!user && <p className="mb-0"><Link className="transition-300" to="/login">Log in</Link> or <Link className="transition-300" to="/signup">Sign up</Link></p>}
          </div>
        </Row>
      </div>
      {/* {error && <Alert variant="danger">{error}</Alert>} */}
    </>
  )
}
