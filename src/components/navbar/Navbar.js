import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaArchive } from "react-icons/fa";
import clsx from 'clsx';
import styles from './styles.module.scss';

const Navbar = () => {
  return (
    <ul className={styles.navbar} id="accordionSidebar">
        <Link to="/" className={clsx(styles.sidebarBrand, "py-3 d-flex align-items-center justify-content-center")}>
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className={styles.sidebarBrandText}>Tasks Dashboard</div>
        </Link>

        <hr className={clsx(styles.sidebarDivider, "mb-0")} />

        <li className="nav-item active">
          <Link className={styles.navLink} to="/">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
        </li>

        <hr className={styles.sidebarDivider} />

        <div className={styles.sidebarHeading}>
          Projects
        </div>

        <li className="nav-item">
          <Link className={styles.navLink} to="/">
            <span>Main project</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className={styles.navLink} to="/">
            <span>Proj 2</span>
          </Link>
        </li>

        <hr className={clsx(styles.sidebarDivider, "mb-0")} />

        <li className="nav-item">
            <a className={clsx(styles.navLink, styles.linkCollapsed, "nav-link collapsed")} href="#" data-toggle="collapse" data-target="#collapseTwo"
                aria-expanded="true" aria-controls="collapseTwo">
              <FaArchive />
              <span>Archive</span>
            </a>
            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Custom Components:</h6>
                <a className="collapse-item" href="buttons.html">Buttons</a>
                <a className="collapse-item" href="cards.html">Cards</a>
              </div>
            </div>
        </li>
    </ul>
  )
}

export { Navbar };