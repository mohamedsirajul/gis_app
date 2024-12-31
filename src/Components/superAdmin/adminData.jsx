import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Card, Container, Row, Col } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

const AdminData = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false); // New state for posting data

  // State for managing the dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State for form fields
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });

  // State for handling success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Validation errors state
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [addressError, setAddressError] = useState("");

  // Fetch admin data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch admin data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://luisnellai.xyz/siraj/admin/getAllAdmin.php"
      );
      setAdmins(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form fields and validation errors when dialog is closed
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      mobile: "",
      address: "",
    });
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setMobileError("");
    setAddressError("");
  };

  // Function to handle input change in form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({
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

  // Function to validate form fields before submission
  const validateForm = () => {
    let isValid = true;

    if (!newAdmin.name) {
      setNameError("Name is required");
      isValid = false;
    }
    if (!newAdmin.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) {
      setEmailError("Email is invalid");
      isValid = false;
    }
    if (!newAdmin.password) {
      setPasswordError("Password is required");
      isValid = false;
    }
    if (!newAdmin.mobile) {
      setMobileError("Mobile number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(newAdmin.mobile)) {
      setMobileError("Mobile number is invalid (must be 10 digits)");
      isValid = false;
    }
    if (!newAdmin.address) {
      setAddressError("Address is required");
      isValid = false;
    }

    return isValid;
  };

  // Function to handle form submission
  const handleAddAdmin = async () => {
    if (validateForm()) {
      setPosting(true); // Set loading state to true when posting data
      try {
        const response = await axios.post(
          "https://luisnellai.xyz/siraj/admin/add_admin.php",
          newAdmin
        );
        setSuccessMessage("Admin added successfully!");
        handleCloseDialog();
        fetchData(); // Refresh admin list after adding new admin
      } catch (error) {
        setErrorMessage("Failed to add admin");
        console.error("Error adding admin:", error);
      } finally {
        setPosting(false); // Set loading state to false when operation completes
      }
    } else {
      setErrorMessage("Please fill in all fields correctly");
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error fetching data: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        style={{ textAlign: "right", marginRight: "0", color: "white" }}
        onClick={handleOpenDialog}
        endIcon={<AddIcon />} // Replace AddIcon with your desired icon component
      >
        Add Admin
      </Button>
      <br />
      <br />
      <Row>
        {admins.map((admin) => (
          <Col key={admin.user_id} md={6} className="mb-4">
            <Card style={{ width: "100%" }}>
              <Card.Body>
                <Card.Title>{admin.name}</Card.Title>
                <Card.Text>
                  <strong>Email:</strong> {admin.email}
                  <br />
                  {/* Add more fields as necessary */}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Dialog for adding new admin */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newAdmin.name}
            onChange={handleInputChange}
            error={!!nameError}
            helperText={nameError}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={newAdmin.email}
            onChange={handleInputChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="text"
            fullWidth
            value={newAdmin.password}
            onChange={handleInputChange}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            margin="dense"
            id="mobile"
            name="mobile"
            label="Mobile"
            type="text"
            fullWidth
            value={newAdmin.mobile}
            onChange={handleInputChange}
            error={!!mobileError}
            helperText={mobileError}
          />
          <TextField
            margin="dense"
            id="address"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={newAdmin.address}
            onChange={handleInputChange}
            error={!!addressError}
            helperText={addressError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddAdmin} color="primary">
            {posting ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display success and error messages */}
      {successMessage && (
        <Alert severity="success" style={{ marginTop: "1rem" }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" style={{ marginTop: "1rem" }}>
          {errorMessage}
        </Alert>
      )}
    </Container>
  );
};

export default AdminData;
