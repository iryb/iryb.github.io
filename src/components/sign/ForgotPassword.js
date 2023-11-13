import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { resetPassword } from "@services/services";
import { Link } from "react-router-dom";
import clsx from "clsx";
import styles from "./styles.module.scss";
import forgotImage from "@assets/images/forgot-password.svg";

export default function ForgotPassword() {
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);
    await resetPassword(emailRef.current.value)
      .then(() => setMessage("Further instructions were sent to your email."))
      .catch((e) => setError(e.message));

    setLoading(false);
  };

  return (
    <div className={clsx(styles.signBg, "d-flex justify-content-center")}>
      <Col md={9} className={clsx(styles.cardContainer, styles.sign)}>
        <Card className={clsx(styles.card, "border-0 shadow-lg my-5")}>
          <Card.Body className="p-0">
            <Row className="m-0">
              <Col
                lg={6}
                className={clsx(styles.loginImage, "d-none d-lg-block")}
                style={{ backgroundImage: `url(${forgotImage})` }}
              ></Col>
              <Col lg={6} className={clsx(styles.formColumn, "p-5")}>
                <h2 className="text-center mb-2">Forgot Your Password?</h2>
                <p className="text-center mb-4">
                  Enter your email address below and we&apos;ll send you a link
                  to reset your password!
                </p>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group
                    className={clsx(styles.formRow, "mb-3")}
                    id="email"
                  >
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      ref={emailRef}
                      required
                    />
                  </Form.Group>
                  <Button
                    disabled={loading}
                    variant="primary"
                    type="submit"
                    className={styles.button}
                  >
                    Reset password
                  </Button>
                </Form>
                <hr />
                <div className="w-100 text-center mt-3">
                  <p className="mb-0">
                    <Link to="/signup">Create an Account!</Link>
                  </p>
                  <p>
                    <Link to="/login">Already have an account? Login!</Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
}
