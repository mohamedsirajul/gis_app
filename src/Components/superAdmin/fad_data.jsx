import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Button as BootstrapButton,
  Modal,
  Form,
} from "react-bootstrap";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";

import Alert from "@mui/material/Alert";
import "./dashboard.css";

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const FadData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newfadAdmin, setNewfadAdmin] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Validation state
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [addressError, setAddressError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://luisnellai.xyz/siraj/getAllFad.php"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = () => {
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewfadAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset validation errors when user starts typing
    switch (name) {
      case "name":
        setNameError("");
        break;
      case "email":
        setEmailError("");
        break;
      case "password":
        setPasswordError("");
        break;
      case "mobile":
        setMobileError("");
        break;
      case "address":
        setAddressError("");
        break;
      default:
        break;
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!newfadAdmin.name) {
      setNameError("Name is required");
      isValid = false;
    }
    if (!newfadAdmin.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newfadAdmin.email)) {
      setEmailError("Email is invalid");
      isValid = false;
    }
    if (!newfadAdmin.password) {
      setPasswordError("Password is required");
      isValid = false;
    }
    if (!newfadAdmin.mobile) {
      setMobileError("Mobile number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(newfadAdmin.mobile)) {
      setMobileError("Mobile number is invalid (must be 10 digits)");
      isValid = false;
    }
    if (!newfadAdmin.address) {
      setAddressError("Address is required");
      isValid = false;
    }

    return isValid;
  };

  const handleAddfadAdmin = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch(
        "https://luisnellai.xyz/siraj/admin/add_fad_admin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newfadAdmin),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setSuccessMessage("fadAdmin added successfully!");
      setShowAddDialog(false);
      // Refetch users to update the list
      fetchUsers();
    } catch (error) {
      setErrorMessage("Failed to add fadAdmin");
      console.error("Error adding fadAdmin:", error);
    }
  };

  // Auto-dismiss alerts after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center">
        <Alert variant="danger">Error: {error.message}</Alert>
      </Container>
    );
  }

  //   const handleviewClick = (user_id) => {
  //     console.log(user_id);
  //     window.location.href = `sviewTask/${user_id}`;
  //   };

  //   const handleviewSurvey = (user_id) => {
  //     console.log(user_id);
  //     window.location.href = `sviewSurvey/${user_id}`;
  //   };

  return (
    <Container>
      <Main>
        <Button
          variant="contained"
          color="primary"
          style={{ textAlign: "right", marginRight: "0", color: "white" }}
          onClick={handleOpenDialog}
          endIcon={<AddIcon />} // Replace AddIcon with your desired icon component
        >
          Add ATE Admin
        </Button>
        <br />
        <br />
        <Row>
          {users.map((user) => (
            <Col key={user.user_id} md={6} className="mb-4">
              <Card style={{ width: "100%" }}>
                <Card.Body>
                  <Card.Title>{user.name}</Card.Title>
                  <Card.Text>
                    <strong>Email:</strong> {user.email}
                    <br />
                    {/* Add more fields as necessary */}
                  </Card.Text>
                  {/* <Button
                    onClick={() => handleviewClick(user.user_id)}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  >
                    View Task
                  </Button>
                  <Button
                    onClick={() => handleviewSurvey(user.user_id)}
                    style={{ cursor: "pointer" }}
                  >
                    View Survey Data
                  </Button> */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Main>

      <Modal show={showAddDialog} onHide={handleCloseDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Add New ATE Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newfadAdmin.name}
                onChange={handleInputChange}
                isInvalid={!!nameError}
              />
              <Form.Control.Feedback type="invalid">
                {nameError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={newfadAdmin.email}
                onChange={handleInputChange}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter password"
                name="password"
                value={newfadAdmin.password}
                onChange={handleInputChange}
                isInvalid={!!passwordError}
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMobile">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile number"
                name="mobile"
                value={newfadAdmin.mobile}
                onChange={handleInputChange}
                isInvalid={!!mobileError}
              />
              <Form.Control.Feedback type="invalid">
                {mobileError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                value={newfadAdmin.address}
                onChange={handleInputChange}
                isInvalid={!!addressError}
              />
              <Form.Control.Feedback type="invalid">
                {addressError}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={handleCloseDialog}>
            Close
          </BootstrapButton>
          <BootstrapButton variant="primary" onClick={handleAddfadAdmin}>
            Add ATEAdmin
          </BootstrapButton>
        </Modal.Footer>
      </Modal>

      <Container className="mt-3">
        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}
      </Container>
    </Container>
  );
};

export default FadData;
