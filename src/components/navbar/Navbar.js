import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaFolder } from "react-icons/fa";
import clsx from 'clsx';
import styles from './styles.module.scss';

const Navbar = ({ isOpened }) => {
  return (
    <ul className={clsx(styles.navbar, isOpened && styles.opened)}>
        <Link to="/" className={clsx(styles.sidebarBrand, "py-3 d-flex align-items-center justify-content-center")}>
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className={styles.sidebarBrandText}>Tasks Dashboard</div>
        </Link>

        <hr className={clsx(styles.sidebarDivider, "mb-0")} />

        <li className="nav-item">
          <NavLink className={styles.navLink} to="/">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <hr className={styles.sidebarDivider} />

        <div className={styles.sidebarHeading}>
          Projects
        </div>

        <li className="nav-item">
          <NavLink className={styles.navLink} to="/project">
            <FaFolder />
            <span>Awesome project</span>
          </NavLink>
        </li>
    </ul>
  )
}

export { Navbar };