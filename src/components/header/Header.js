import React, { useState, useRef } from 'react'
import { Row, Col, Dropdown, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from "@store/userSlice";
import { searchByText } from "@store/tasksSlice";
import { FaSearch, FaCogs, FaDoorClosed, FaBars } from "react-icons/fa";
import styles from './styles.module.scss';
import clsx from 'clsx';

export default function Header({ toggleMenu }) {
  // const [error, setError] = useState('')
  const [menuOpened, setMenuOpened] = useState(false);
  const searchRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  }

  const handeSearch = (e) => {
    e.preventDefault();
    dispatch(searchByText({ text: searchRef.current.value }))
  }

  const handleToggleMenu = () => {
    setMenuOpened(!menuOpened);
    toggleMenu(menuOpened);
  }

  return (
    <>
      <div className={clsx(styles.headerWrapper, "mb-4 bg-white shadow")}>
        <div className={clsx(styles.header, "m-0")}>
          {user &&
            <Row>
              <button className={clsx("btn btn-link d-md-none", styles.navbarToggler)} onClick={handleToggleMenu}>
                <FaBars />
              </button>
              <Col className={clsx("d-flex align-items-center", styles.searchCol)}>
                <Form onSubmit={handeSearch}>
                  <Form.Group className={styles.searchBar}>
                    <Form.Control type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                        aria-label="Search" ref={searchRef} />
                    <Button variant="primary" type="submit">
                      <FaSearch />
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
              <Col className={clsx("d-flex justify-content-end", styles.userCol)}>
                {/* TODO
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
                </Dropdown> */}
                <Dropdown className="d-flex align-items-center">
                  <Dropdown.Toggle className={styles.userInfo}>
                    <span className="small">{user.displayName}</span>
                    <img className="img-profile rounded-circle"
                        src={user.photoURL} />
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
        </div>
      </div>
    </>
  )
}
