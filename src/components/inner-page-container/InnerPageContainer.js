import React, { useState } from 'react';
import { Navbar } from '../navbar/Navbar';
import styles from './styles.module.scss';
import clsx from 'clsx';
import Header from '../header/Header';

export const InnerPageContainer = ({ children }) => {
  const [menuState, setMenuState] = useState();

  const toggleMenu = (isMenuOpened) => {
    setMenuState(isMenuOpened);
  }

  return (
    <>
      <div className="d-flex">
        <Navbar isOpened={menuState} />
        <div className={clsx(styles.contentWrapper, "d-flex flex-column")}>
          <Header toggleMenu={toggleMenu} />
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
