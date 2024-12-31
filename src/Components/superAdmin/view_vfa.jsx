import React, { useEffect, useState } from "react";
import {
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  AppBar,
  Toolbar,
  ListItemIcon,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const ViewVfa = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(false); // State to trigger data fetch
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (fetchTrigger && fromDate && toDate && !validationError) {
      fetchData();
      setFetchTrigger(false); // Reset fetch trigger after fetching data
    }
  }, [fetchTrigger, fromDate, toDate, validationError]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://luisnellai.xyz/siraj/get_all_filter_data.php",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
      console.log(response.data.properties);
      setData(response.data.properties);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const validateDates = () => {
    if (fromDate > toDate) {
      setValidationError("From Date cannot be after To Date.");
    } else {
      setValidationError("");
    }
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    setValidationError(""); // Reset validation error on date change
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setValidationError(""); // Reset validation error on date change
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //   const handleLogout = () => {
  //     localStorage.removeItem("vfa_token");
  //     window.location.href = "/vfa_admin_login";
  //   };

  const handleFetchData = () => {
    if (fromDate && toDate && !validationError) {
      setFetchTrigger(true);
    }
  };

  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* <AppBar position="static" style={{ backgroundColor: "lightblue" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            style={{ color: "black" }}
            sx={{ flexGrow: 1 }}
          >
            View Floor Analysis
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="black"
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
      </AppBar> */}

      <br />
      <br />
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h6" style={{ textAlign: "center" }}>
              <b>Assessment Tax Comparison Report</b>
            </Typography>

            <Typography variant="h6">Filter Data</Typography>
            <br />
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: today, // Set max to today's date
              }}
              sx={{ marginRight: 2 }}
              onBlur={validateDates}
            />
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: today, // Set max to today's date
                min: fromDate || today, // Ensure min is set to "From Date" or today
              }}
              onBlur={validateDates}
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "lightblue", color: "black" }}
              onClick={handleFetchData} // Changed to trigger data fetch
              sx={{ marginLeft: 2 }}
              disabled={!!validationError}
            >
              Fetch Data
            </Button>
            {validationError && (
              <Alert severity="error" sx={{ marginTop: 2 }}>
                {validationError}
              </Alert>
            )}
          </CardContent>
        </Card>
        <br />
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                style={{
                  border: "2px solid black",
                  fontWeight: "bold",
                  textAlign: "center",
                  backgroundColor: "lightblue",
                  //   backgroundColor: "#e65ca8",
                }}
              >
                <TableRow>
                  <TableCell
                    style={{
                      border: "2px solid black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    S.No
                  </TableCell>
                  <TableCell
                    style={{
                      border: "2px solid black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Assessment No
                  </TableCell>
                  <TableCell
                    style={{
                      border: "2px solid black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Existing Tax
                  </TableCell>
                  <TableCell
                    style={{
                      border: "2px solid black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Proposed Tax
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ border: "2px solid black", textAlign: "center" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{ border: "2px solid black", textAlign: "center" }}
                    >
                      {property.AssessmentNo}
                    </TableCell>
                    <TableCell
                      style={{ border: "2px solid black", textAlign: "center" }}
                    >
                      {property.existing_tax}
                    </TableCell>
                    <TableCell
                      style={{ border: "2px solid black", textAlign: "center" }}
                    >
                      {property.TotalFloorTax}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default ViewVfa;
