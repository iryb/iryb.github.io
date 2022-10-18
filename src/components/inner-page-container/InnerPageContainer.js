import React from 'react';
import { Navbar } from '../navbar/Navbar';
import styles from './styles.module.scss';
import clsx from 'clsx';
import Header from '../header/Header';

export const InnerPageContainer = ({ children }) => {
  return (
    <>
      <div className="d-flex">
        <Navbar />
        <div className={clsx(styles.contentWrapper, "d-flex flex-column")}>
          <Header />
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
