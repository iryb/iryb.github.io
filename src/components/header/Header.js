import React from 'react'
import { Row, Col, Dropdown, Form, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../store/userSlice";
import { selectUser } from "../../store/userSlice";
import { FaBell, FaSearch, FaCogs, FaDoorClosed, FaBars } from "react-icons/fa";
import Avatar from "../../data/undraw_profile.svg";
import styles from './styles.module.scss';
import clsx from 'clsx';

export default function Header() {
  // const [error, setError] = useState('')
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  }

  const handeSearch = () => {

  }

  return (
    <>
      <div className="mb-4 bg-white shadow">
        <Row className={styles.header}>
          {user &&
            <Row>
              <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <FaBars />
              </button>
              <Col className="d-flex align-items-center">
                <Form onSubmit={handeSearch}>
                  <Form.Group className={styles.searchBar}>
                    <Form.Control type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                        aria-label="Search" />
                    <Button variant="primary">
                      <FaSearch />
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
              <Col className="d-flex justify-content-end">
                <Dropdown className={clsx(styles.notificationsDropdown, "d-flex align-items-center")}>
                  <Dropdown.Toggle className={styles.icon}>
                    <FaBell />
                    <Badge className={styles.counter} bg="danger">3+</Badge>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                      <Dropdown.Header>Recent notifications</Dropdown.Header>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                          <div className="mr-3">
                              <div className="icon-circle bg-primary">
                                  <i className="fas fa-file-alt text-white"></i>
                              </div>
                          </div>
                          <div>
                              <div className="small text-gray-500">December 12, 2019</div>
                              <span className="font-weight-bold">A new monthly report is ready to download!</span>
                          </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                          <div className="mr-3">
                              <div className="icon-circle bg-success">
                                  <i className="fas fa-donate text-white"></i>
                              </div>
                          </div>
                          <div>
                              <div className="small text-gray-500">December 7, 2019</div>
                              $290.29 has been deposited into your account!
                          </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                          <div className="mr-3">
                              <div className="icon-circle bg-warning">
                                  <i className="fas fa-exclamation-triangle text-white"></i>
                              </div>
                          </div>
                      </a>
                      <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="d-flex align-items-center">
                  <Dropdown.Toggle className={styles.userInfo}>
                    <span className="small">{user.email}</span>
                    <img className="img-profile rounded-circle"
                        src={Avatar} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={clsx(styles.userNav, "shadow")}>
                    <Dropdown.Item as={Link} to="/update-profile">
                      <FaCogs />
                      <span>Settings</span>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <FaDoorClosed />
                      <span>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          }
          {!user && <p className="mb-0"><Link className="transition-300" to="/login">Log in</Link> or <Link className="transition-300" to="/signup">Sign up</Link></p>}
        </Row>
      </div>
    </>
  )
}
