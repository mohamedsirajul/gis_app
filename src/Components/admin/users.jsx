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
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { Card, Container, Row, Col } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
const Surveyors = () => {
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for managing the dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State for form fields
  const [newSurveyor, setNewSurveyor] = useState({
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

  // State for managing menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // Add these new state variables
  const [openSurveyLog, setOpenSurveyLog] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [surveyLogs, setSurveyLogs] = useState([]);
  const [showSurveyResults, setShowSurveyResults] = useState(false);

  // Fetch surveyor data on component mount
  useEffect(() => {
    fetchSurveyors();
  }, []);

  // Function to fetch surveyor data
  const fetchSurveyors = async () => {
    try {
      const response = await axios.get(
        "https://luisnellai.xyz/siraj/admin/getAllUsers.php"
      );
      setSurveyors(response.data);

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
    setNewSurveyor({
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

  // Function to validate form fields before submission
  const validateForm = () => {
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

  // Function to handle form submission
  const handleAddSurveyor = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post(
          "https://luisnellai.xyz/siraj/admin/add_user.php",
          newSurveyor
        );
        setSuccessMessage("Surveyor added successfully!");
        handleCloseDialog();
        fetchSurveyors(); // Refresh surveyor list after adding new surveyor
      } catch (error) {
        setErrorMessage("Failed to add surveyor");
        console.error("Error adding surveyor:", error);
      }
    } else {
      setErrorMessage("Please fill in all fields correctly");
    }
  };

  // Function to handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = (user_id) => {
    // history.push(`/user/${id}`);
    console.log(user_id);
    window.location.href = `/assignTask/${user_id}`;
  };

  const handleviewClick = (user_id) => {
    // history.push(`/user/${id}`);
    console.log(user_id);
    window.location.href = `/viewTask/${user_id}`;
  };

  const handleviewSurvey = (user_id) => {
    // history.push(`/user/${id}`);
    console.log(user_id);
    window.location.href = `/viewSurvey/${user_id}`;
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
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
      
      const response = await axios.get(
        `https://luisnellai.xyz/siraj/getsurveylog.php?from_date=${formattedFromDate}&to_date=${formattedToDate}`
      );

      setSurveyLogs(response.data.data);
      setShowSurveyResults(true);
    } catch (error) {
      setErrorMessage("Failed to fetch survey logs");
      console.error("Error fetching survey logs:", error);
    }
  };

  if (loading) {
    return (
      <Container
        style={{
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
        <Alert variant="danger">Error fetching data: {error.message}</Alert>
      </Container>
    );
  }
  const FilterAd = () => {
    window.location.href = "/filterad";
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Surveyor Management
          </Typography>
          <Button
            color="inherit"
            onClick={FilterAd}
            sx={{ mr: 2 }}
          >
            Survey Data 
          </Button>
          <Button
            color="inherit"
            onClick={handleOpenSurveyLog}
            startIcon={<CalendarTodayIcon />}
            sx={{ mr: 2 }}
          >
            Survey Log
          </Button>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={menuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <br />
      <br />
      <br />
      <Container>
        {/* Toolbar */}
        {/* Main content */}
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "1rem", marginRight: "1rem" }}
          onClick={() => window.location.href = "/addpropcsv"}
        >
          Add Property CSV
        </Button>
        
        <Row xs={1} md={2} className="g-4">
          {surveyors.map((surveyor) => (
            <Col key={surveyor.id}>
              <Card>
                <Card.Body>
                  <Card.Text>
                  
                    <strong>User Name:</strong> {surveyor.name}
                    <br />
                    <strong>User Id:</strong> {surveyor.user_id}
                    <br />
                    <strong>Email:</strong> {surveyor.email}
                    <br />
                    <strong>Mobile:</strong> {surveyor.mobile}
                    <br />
                    <br />
                    <Button
                      onClick={() => handleCardClick(surveyor.user_id)}
                      style={{ cursor: "pointer" }}
                    >
                      Assign Task
                    </Button>
                    <Button
                      onClick={() => handleviewClick(surveyor.user_id)}
                      style={{ cursor: "pointer" }}
                    >
                      View Task
                    </Button>
                    <Button
                      onClick={() => handleviewSurvey(surveyor.user_id)}
                      style={{ cursor: "pointer" }}
                    >
                      View Survey Data
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Dialog for adding new surveyor */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add New Surveyor</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={newSurveyor.name}
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
              value={newSurveyor.email}
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
              value={newSurveyor.password}
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
              value={newSurveyor.mobile}
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
              value={newSurveyor.address}
              onChange={handleInputChange}
              error={!!addressError}
              helperText={addressError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleAddSurveyor}
              variant="contained"
              color="primary"
            >
              Add Surveyor
            </Button>
          </DialogActions>
        </Dialog>
        {/* Success and Error Messages */}
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
        {/* Add the Survey Log Dialog */}
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
                      <>
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
                      </>
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
      </Container>
    </>
  );
};

export default Surveyors;
