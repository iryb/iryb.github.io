import React from 'react';
import styles from './styles.module.scss';
import clsx from "clsx";

export default function UserAvatar({ userName, photo, className }) {
  return (
    <>
      {userName && <div className={clsx(styles.userAvatar, className)}>
        {photo && 
          <img src={photo} alt={userName} title={userName} />}
        {!photo && 
          <span>{userName.charAt(0)}</span>}
      </div>}
    </>
  );
}