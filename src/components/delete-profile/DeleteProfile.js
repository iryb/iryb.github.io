import React, { useState, useRef } from "react";
import ModalWindow from "../modal-window/ModalWindow";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteProfile } from "@services/services";
import { logout } from "@store/userSlice";

export default function DeleteProfile({ show, onHide }) {
  const [error, setError] = useState("");
  const relogPasswordRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserDelete = (e) => {
    e.preventDefault();
    setError("");

    if (relogPasswordRef.current.value) {
      deleteProfile({ password: relogPasswordRef.current.value })
        .then(() => dispatch(logout()))
        .then(() => navigate("/"))
        .catch((e) => {
          onHide();
          setError("Failed to delete account : " + e.message);
        });
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <ModalWindow
        show={show}
        onHide={onHide}
        title="Profile deletion"
        text="Are you sure you want to delete your account?"
      >
        <Form onSubmit={handleUserDelete}>
          <Form.Group className="mb-3" id="relogPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              ref={relogPasswordRef}
              className="inputRound"
            />
          </Form.Group>
          <div className="buttonsContainer mt-4 mb-3">
            <Button variant="primary" type="submit" className="btnRound mx-2">
              Delete
            </Button>
            <Button variant="danger" onClick={onHide} className="btnRound mx-2">
              Cancel
            </Button>
          </div>
        </Form>
      </ModalWindow>
    </>
  );
}
