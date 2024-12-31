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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const Vfa = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(false); // State to trigger data fetch
  const menuOpen = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [SelectedData, setSelectedData] = useState([]);

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

  const handleLogout = () => {
    localStorage.removeItem("vfa_token");
    window.location.href = "/";
  };

  const handleFetchData = () => {
    if (fromDate && toDate && !validationError) {
      setFetchTrigger(true);
    }
  };

  const fetchDataByAssessmentNo = (assessmentNo) => {
    const requestBody = { assessmentNo: assessmentNo };

    fetch("https://luisnellai.xyz/siraj/get_data_byassono.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSelectedData(data.properties); // Assuming API response provides properties array
        console.log(data.properties);
        setOpenDialog(true);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data by assessment no:", error);
      });
  };

  const handleClickOpenDetails = (assessmentNo) => {
    setLoading(true);

    fetchDataByAssessmentNo(assessmentNo);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedData([]);
  };

  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#eb3499" }}>
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
      </AppBar>

      <br />
      <br />
      <Container>
        <Card>
          <CardContent>
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
              onBlur={validateDates}
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "#eb3499", color: "black" }}
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
                  backgroundColor: "#eb3499",
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
                    SNO
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
                    View Datails
                  </TableCell>
                  <TableCell
                    style={{
                      border: "2px solid black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Existing Tax (in Rs)
                  </TableCell>
                  <TableCell
                    style={{
                      border: "2px solid black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Proposed Tax (in Rs)
                  </TableCell>
                  <TableCell
                    style={{
                      border: "2px solid black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Variation (in Rs)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((property, index) => {
                  // Calculate variation
                  const variation =
                    property.TotalFloorTax - property.existing_tax;

                  return (
                    <TableRow key={index}>
                      <TableCell
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        {property.AssessmentNo}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: "#eb3499",
                            color: "white",
                          }}
                          onClick={() =>
                            handleClickOpenDetails(property.AssessmentNo)
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        {property.existing_tax}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        {property.TotalFloorTax}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        {variation}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Table Footer for Totals */}
                <TableRow>
                  <TableCell
                    colSpan={3}
                    style={{ border: "2px solid black", textAlign: "center" }}
                  >
                    Total (in Rs)
                  </TableCell>
                  <TableCell
                    style={{ border: "2px solid black", textAlign: "center" }}
                  >
                    {data.reduce(
                      (total, property) =>
                        total + Number(property.existing_tax),
                      0
                    )}
                  </TableCell>
                  <TableCell
                    style={{ border: "2px solid black", textAlign: "center" }}
                  >
                    {data.reduce(
                      (total, property) => total + property.TotalFloorTax,
                      0
                    )}
                  </TableCell>
                  <TableCell
                    style={{ border: "2px solid black", textAlign: "center" }}
                  >
                    {data.reduce(
                      (total, property) =>
                        total +
                        (property.TotalFloorTax - property.existing_tax),
                      0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="lg" // Setting maxWidth to 'lg' for large width
        >
          <DialogTitle style={{ textAlign: "center" }}>
            Assesment Details
          </DialogTitle>
          <DialogContent dividers>
            {SelectedData.length > 0 ? (
              SelectedData.map((property, index) => (
                <div key={index}>
                  {/* <Typography variant="h6">
                  Assessment No: {property.AssessmentNo}
                </Typography>
                <Typography variant="h6">
                  <b> Existing Tax: </b>
                  {property.existing_tax}
                </Typography>
                <Typography variant="h6">
                  <b> Proposed Tax: </b>
                  {property.TotalFloorTax}
                </Typography> */}
                  <Typography variant="h6">
                    Assessment Information - {property.zone}
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow
                        style={{
                          backgroundColor: "#eb3499",
                          color: "white",
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                          }}
                        >
                          Assessment No
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                          }}
                        >
                          Existing Tax (in Rs)
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                          }}
                        >
                          Proposes Tax (in Rs)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      style={{ border: "2px solid black", textAlign: "center" }}
                    >
                      <TableRow
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.AssessmentNo}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.existing_tax}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.TotalFloorTax}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <br />
                  <Typography variant="h6">Assessment Details</Typography>
                  <Table>
                    <TableHead>
                      <TableRow
                        style={{
                          backgroundColor: "#eb3499",
                          color: "white",
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          GIS Id
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Zone
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Building Name
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Total Floor
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Address
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          City
                        </TableCell>

                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Mobile
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Owner
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Building Used As
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      style={{ border: "2px solid black", textAlign: "center" }}
                    >
                      <TableRow
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.Gisid}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.zone}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.BuildingName}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.TotalFloor}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >{`${property.address1}, ${property.address2}, ${property.area}, ${property.pinCode}`}</TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.city}
                        </TableCell>

                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.Mobile}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.Owner}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.Buildingusedas}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <br></br>

                  <Typography variant="h6">Floor Details</Typography>
                  {property.floorInformation &&
                  property.floorInformation.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow
                          style={{
                            backgroundColor: "#eb3499",
                            color: "white",
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                          }}
                        >
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Floor
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Floor Id
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Floor Area (in Sq.ft)
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Establishment
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Establishment Name
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Flat No
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Occupancy
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Usage
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Floor Tax (in Rs)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        {property.floorInformation.map((floor, floorIndex) => (
                          <TableRow
                            key={floorIndex}
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.floor}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.id}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.area}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.establishment}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.establishmentName}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.flatNo}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.occupancy}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.usage}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.floor_tax}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          ></TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          ></TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          ></TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          ></TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          ></TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          ></TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          ></TableCell>
                          <TableCell
                            style={{
                              textAlign: "right",
                              border: "2px solid black",
                            }}
                          >
                            Total Floor Tax
                          </TableCell>
                          <TableCell>{property.TotalFloorTax}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography>No floor details available</Typography>
                  )}
                  <br />
                  <Typography variant="h6">Facility Details</Typography>
                  <Table>
                    <TableHead
                      style={{
                        border: "2px solid black",
                        textAlign: "center",
                        backgroundColor: "#eb3499",
                        color: "white",
                      }}
                    >
                      <TableRow>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Hoarding
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Mobile Tower
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Head Room
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          OHT
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Parking
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Ramp
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      style={{
                        border: "2px solid black",
                        textAlign: "center",
                      }}
                    >
                      <TableRow
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.Hoarding === "yes" ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.MobileTower === "yes" ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.headRooms}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.oht}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.parking}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.ramp}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.Hoarding_tax}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.MTower_tax}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.H_Room_tax}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.oht_tax}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.parking_tax}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {property.ramp_tax}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <br />
                </div>
              ))
            ) : (
              <Typography>No tax details available</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              style={{
                backgroundColor: "#eb3499",
                color: "white",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Vfa;
