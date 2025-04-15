import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Importing toastify module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
// import { useAuth } from './AuthProvider'
import "react-toastify/dist/ReactToastify.css"; // Import toastify css file
import "./LoginForm.css";
import logo from "../assets/images/Resolution_Digital_Logo_Final.png";
import { useAuth } from "./AuthProvider";

const LoginForm = () => {
  const [User_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIspending] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIspending(true);

    const data = { User_name, password };

    try {
      const user = await login(data);
      setIspending(false);
      // toast.success('Login Successful!', {
      //     position: toast.POSITION.BOTTOM_RIGHT,
      //     theme: 'colored'
      // })
      switch (user[0].User_type) {
        case 1:
          navigate("/itdashboard");
          break;
        case 2:
          navigate("/instdashboard");
          break;
        case 3:
          navigate("/bankdashboard");
          break;
        case 4:
          navigate("/lawyerdashboard");
          break;
        case 5:
          navigate("/arbdashboard");
          break;
        default:
          toast.error("Unknown user role!", {
            // position: toast.POSITION.BOTTOM_RIGHT,
            theme: "colored",
          });
          break;
      }
    } catch (error) {
      setIspending(false);
      toast.error(error.message, {
        // position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center form">
        <Col md={4} className="login-form animate__animated animate__fadeInUp">
          <div className="logo">
            <img src={logo} alt="Logo" />
            <h2 className="text-center mb-4">Login</h2>
          </div>
          <Form onSubmit={handleLogin}>
            <Form.Group
              controlId="formUsername"
              className="position-relative mb-4"
            >
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={User_name}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input animate__animated animate__fadeInLeft"
              />
              <FontAwesomeIcon
                icon={faUser}
                className="input-icon animate__animated animate__fadeInLeft"
              />
            </Form.Group>
            <Form.Group
              controlId="formPassword"
              className="position-relative mb-4"
            >
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input animate__animated animate__fadeInRight"
              />
              <FontAwesomeIcon
                icon={faLock}
                className="input-icon animate__animated animate__fadeInRight"
              />
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center mt-5">
              <Button
                type="submit"
                variant=""
                disabled={isPending}
                className="login-button animate__animated animate__pulse"
              >
                {isPending ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Login"
                )}
              </Button>
              <Button
                className="ms-3 cancel-button animate__animated animate__pulse"
                variant=""
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default LoginForm;


