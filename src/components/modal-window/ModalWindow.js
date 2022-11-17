import React from 'react';
import { Modal } from 'react-bootstrap';

export default function ModalWindow({ show, onHide, title, text, children }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{text}</p>
        {children}
      </Modal.Body>
    </Modal>
  )
}