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
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Box
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));



const Surveyor = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSurveyor, setNewSurveyor] = useState({
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

  const [openSurveyLog, setOpenSurveyLog] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [surveyLogs, setSurveyLogs] = useState([]);
  const [showSurveyResults, setShowSurveyResults] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://luisnellai.xyz/siraj/admin/getAllUsers.php"
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
    setNewSurveyor((prev) => ({
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

    if (!newSurveyor.name) {
      setNameError("Name is required");
      isValid = false;
    }
    if (!newSurveyor.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newSurveyor.email)) {
      setEmailError("Email is invalid");
      isValid = false;
    }
    if (!newSurveyor.password) {
      setPasswordError("Password is required");
      isValid = false;
    }
    if (!newSurveyor.mobile) {
      setMobileError("Mobile number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(newSurveyor.mobile)) {
      setMobileError("Mobile number is invalid (must be 10 digits)");
      isValid = false;
    }
    if (!newSurveyor.address) {
      setAddressError("Address is required");
      isValid = false;
    }

    return isValid;
  };

  const handleAddSurveyor = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch(
        "https://luisnellai.xyz/siraj/admin/add_user.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSurveyor),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setSuccessMessage("Surveyor added successfully!");
      setShowAddDialog(false);
      // Refetch users to update the list
      fetchUsers();
    } catch (error) {
      setErrorMessage("Failed to add surveyor");
      console.error("Error adding surveyor:", error);
    }
  };

  const handleOpenSurveyLog = () => {
    setOpenSurveyLog(true);
    setShowSurveyResults(false);
    setFromDate(null);
    setToDate(null);
  };

  const handleCloseSurveyLog = () => {
    setOpenSurveyLog(false);
    setShowSurveyResults(false);
  };

  const fetchSurveyLogs = async () => {
    if (!fromDate || !toDate) {
      setErrorMessage("Please select both dates");
      return;
    }

    try {
      const formattedFromDate = dayjs(fromDate).format('YYYY-MM-DD');
      const formattedToDate = dayjs(toDate).format('YYYY-MM-DD');
      
      const response = await fetch(
        `https://luisnellai.xyz/siraj/getsurveylog.php?from_date=${formattedFromDate}&to_date=${formattedToDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch survey logs');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setSurveyLogs(data.data);
        setShowSurveyResults(true);
      } else {
        setErrorMessage(data.message || 'Failed to fetch survey logs');
      }
    } catch (error) {
      setErrorMessage("Failed to fetch survey logs");
      console.error("Error fetching survey logs:", error);
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

  const handleviewClick = (user_id) => {
    console.log(user_id);
    window.location.href = `sviewTask/${user_id}`;
  };

  const handleviewSurvey = (user_id) => {
    console.log(user_id);
    window.location.href = `sviewSurvey/${user_id}`;
  };

  return (
    <Container>
      <Main>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            endIcon={<AddIcon />}
          >
            Add Surveyor
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenSurveyLog}
            endIcon={<AssessmentIcon />}
          >
            Survey Log
          </Button>
        </div>

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
                  <Button
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
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Dialog 
          open={openSurveyLog} 
          onClose={handleCloseSurveyLog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Survey Log</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  fullWidth
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  fullWidth
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                onClick={fetchSurveyLogs}
                sx={{ mt: 2 }}
              >
                Show Results
              </Button>
            </Box>

            {showSurveyResults && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell align="right">Survey Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {surveyLogs.map((dateLog) => (
                      <React.Fragment key={dateLog.survey_date}>
                        {dateLog.users.map((user, userIndex) => (
                          <TableRow key={`${dateLog.survey_date}-${user.user_id}`}>
                            {userIndex === 0 && (
                              <TableCell rowSpan={dateLog.users.length}>
                                {dateLog.survey_date}
                              </TableCell>
                            )}
                            <TableCell>{user.user_name}</TableCell>
                            <TableCell align="right">{user.survey_count}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                            Total for {dateLog.survey_date}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {dateLog.total_surveys}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSurveyLog}>Close</Button>
          </DialogActions>
        </Dialog>

        <Modal show={showAddDialog} onHide={handleCloseDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Surveyor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={newSurveyor.name}
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
                  value={newSurveyor.email}
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
                  value={newSurveyor.password}
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
                  value={newSurveyor.mobile}
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
                  value={newSurveyor.address}
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
            <BootstrapButton variant="primary" onClick={handleAddSurveyor}>
              Add Surveyor
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
      </Main>
    </Container>
  );
};

export default Surveyor;
