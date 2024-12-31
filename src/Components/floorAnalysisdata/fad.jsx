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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";

const Fad = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openTaxDialog, setOpenTaxDialog] = useState(false);
  const [openAddTaxDialog, setOpenAddTaxDialog] = useState(false);
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  // const [FloorsubmittedData, setFloorSubmittedData] = useState([]);
  // const [FacilitysubmittedData, setFacilitySubmittedData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [taxData, setTaxData] = useState({});
  const [facilityData, setFacilityData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("fad_token");
    window.location.href = "/";
  };
  const FilterAd = () => {
    window.location.href = "/filterad";
  }

  const fetchData = () => {
    fetch("https://luisnellai.xyz/siraj/flooranalysisdata.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
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
        setSelectedTaxes(data.properties); // Assuming API response provides properties array
        console.log(data.properties);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data by assessment no:", error);
      });
  };

  const handleClickOpenTaxDetails = (assessmentNo) => {
    setLoading(true);

    fetchDataByAssessmentNo(assessmentNo);
    setOpenTaxDialog(true);
  };

  const handleClickOpenAddTaxDialog = (
    properties,
    floor,
    detail,
    assessmentNo
  ) => {
    // console.log(floor);
    setLoading(true);

    fetchDataByAssessmentNo(assessmentNo);

    setOpenAddTaxDialog(true);
  };

  const handleCloseTaxDialog = () => {
    setOpenTaxDialog(false);
    setSelectedTaxes([]);
  };

  const handleCloseAddTaxDialog = () => {
    setOpenAddTaxDialog(false);
    setSelectedTaxes([]);
    setTaxData({});
    // setFloorSubmittedData([]);
    // setFacilitySubmittedData([]);
  };

  const handleAddTaxChange = (e, floorId) => {
    setTaxData({ ...taxData, [floorId]: e.target.value });
  };

  const handleAddFacilityTaxChange = (e, propId, field) => {
    setFacilityData({
      ...facilityData,
      [propId]: {
        ...facilityData[propId],
        [field]: e.target.value,
      },
    });
  };
  const handleAddTaxSubmitAll = () => {
    const updatedFloorSubmittedData = selectedTaxes
      .map((property) =>
        property.floorInformation
          .filter(
            (floor) =>
              taxData[floor.id] !== undefined && taxData[floor.id] !== ""
          )
          .map((floor) => ({
            floorId: floor.id,
            tax: taxData[floor.id],
          }))
      )
      .flat();

    const updatedFacilitySubmittedData = selectedTaxes
      .map((property) => {
        const facilityDataForProperty = facilityData[property.prop_id] || {};
        const filteredFacilityData = Object.entries(facilityDataForProperty)
          .filter(([key, value]) => value !== undefined && value !== "")
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        return {
          propId: property.prop_id,
          ...filteredFacilityData,
          floorUpdates: updatedFloorSubmittedData.filter((floor) =>
            property.floorInformation.some((pf) => pf.id === floor.floorId)
          ),
        };
      })
      .filter((property) => Object.keys(property).length > 1);

    console.log("All submitted data:", updatedFacilitySubmittedData);

    // Sending all data to the server
    fetch("https://luisnellai.xyz/siraj/add_tax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFacilitySubmittedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tax added successfully:", data);
        setOpenAddTaxDialog(false);
        fetchData();
      })
      .catch((error) => {
        console.error("Error adding tax:", error);
      });
  };

  // const handleAddTaxSubmitAll = () => {
  //   const updatedSubmittedData = selectedTaxes.map((property) => ({
  //     propId: property.prop_id,
  //     hoardingtax: facilityData[property.prop_id]?.hoardingtax || "",
  //     mobiletowertax: facilityData[property.prop_id]?.mobiletowertax || "",
  //     headroomtax: facilityData[property.prop_id]?.headroomtax || "",
  //     ohttax: facilityData[property.prop_id]?.ohttax || "",
  //     parkingtax: facilityData[property.prop_id]?.parkingtax || "",
  //     ramptax: facilityData[property.prop_id]?.ramptax || "",
  //   }));
  //   console.log(updatedSubmittedData[0]);
  // };
  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container>
        <Alert severity="error">
          {error ? error.message : "Failed to fetch data"}
        </Alert>
      </Container>
    );
  }

  const renderedAssessmentNos = new Set();

  return (
    <>
      {" "}
      <AppBar position="static" style={{ backgroundColor: "#eb3f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ATE Management
          </Typography>
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
      <Container>
        <Card variant="outlined" style={{ marginTop: "20px" }}>
          <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <Typography variant="h6" component="h3" style={{ marginTop: "20px", textAlign: "center" }}>
    <b>Assessment Tax Estimation</b>
  </Typography>
  <Button style={{ marginTop: "20px" , backgroundColor:"#f05b4d", color:"white" }} onClick={FilterAd} >Filter Assessments Information</Button>
</div>


            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead
                  style={{
                    backgroundColor: "#f05b4d",
                    border: "2px solid black",
                    textAlign: "center",
                  }}
                >
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        border: "2px solid black",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      GIS ID
                    </TableCell>
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
                      Floor
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        border: "2px solid black",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Floor Area (in Sq.ft)
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        border: "2px solid black",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Total Area (in Sq.ft)
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                        border: "2px solid black",
                      }}
                    >
                      Roof Area (Drone Survey in Sq.ft)
                    </TableCell>
{/* 
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        border: "2px solid black",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Add Tax
                    </TableCell> */}
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        border: "2px solid black",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      View Tax Details
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  style={{
                    border: "2px solid black",
                    textAlign: "center",
                  }}
                >
                  {data.map((item, index) =>
                    item.floors.map((floor, floorIndex) =>
                      floor.floordetails.map((detail, detailIndex) => (
                        <TableRow
                          key={`${item.gisid}-${floorIndex}-${detailIndex}`}
                          style={{
                            border: "2px solid black",
                            textAlign: "center",
                          }}
                        >
                          {detailIndex === 0 && (
                            <TableCell
                              rowSpan={floor.floordetails.length}
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {item.gisid}
                            </TableCell>
                          )}
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            {detail.properties.AssessmentNo}{" "}
                          </TableCell>
                          {detailIndex === 0 && (
                            <TableCell
                              rowSpan={floor.floordetails.length}
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.floor}
                            </TableCell>
                          )}
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            {detail.area}
                          </TableCell>
                          {detailIndex === 0 && (
                            <TableCell
                              rowSpan={floor.floordetails.length}
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.total_area}
                            </TableCell>
                          )}
                          {detailIndex === 0 && (
                            <TableCell
                              rowSpan={floor.floordetails.length}
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {item.drone_area}
                            </TableCell>
                          )}
                          {/* <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleClickOpenPropertyDetails(detail.properties)
                            }
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell> */}
                          {/* <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <Button
                              style={{
                                backgroundColor: "#f05b4d",
                                color: "white",
                              }}
                              onClick={() =>
                                handleClickOpenAddTaxDialog(
                                  detail.properties,
                                  floor,
                                  detail,
                                  detail.properties.AssessmentNo
                                )
                              }
                            >
                              Add Tax
                            </Button>
                          </TableCell> */}
                          {detailIndex === 0 &&
                            !renderedAssessmentNos.has(
                              detail.properties.AssessmentNo
                            ) && (
                              <TableCell
                                rowSpan={
                                  renderedAssessmentNos.has(
                                    detail.properties.AssessmentNo
                                  )
                                    ? 0
                                    : floor.floordetails.length
                                }
                                style={{
                                  border: "2px solid black",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  style={{
                                    backgroundColor: "#f05b4d",
                                    color: "white",
                                  }}
                                  onClick={() =>
                                    handleClickOpenTaxDetails(
                                      detail.properties.AssessmentNo
                                    )
                                  }
                                >
                                  View Tax Details
                                </Button>
                              </TableCell>
                            )}
                        </TableRow>
                      ))
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog
          open={openTaxDialog}
          onClose={handleCloseTaxDialog}
          maxWidth="lg" // Setting maxWidth to 'lg' for large width
        >
          <DialogTitle style={{ textAlign: "center" }}>Tax Details</DialogTitle>
          <DialogContent dividers>
            {selectedTaxes.length > 0 ? (
              selectedTaxes.map((property, index) => (
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
                          backgroundColor: "#f05b4d",
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
                          backgroundColor: "#f05b4d",
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
                            backgroundColor: "#f05b4d",
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
                            Area Calculation
                          </TableCell>
                          {/* <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Establishment Name
                          </TableCell> */}
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
                            Construction Type
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
                              {floor.area_calculation}
                            </TableCell>
                            {/* <TableCell
                              style={{
                                border: "2px solid black",
                                textAlign: "center",
                              }}
                            >
                              {floor.establishmentName}
                            </TableCell> */}
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
                        backgroundColor: "#f05b4d",
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
            <br />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseTaxDialog}
              style={{
                backgroundColor: "#f05b4d",
                color: "white",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Adding Tax */}
        <Dialog
          open={openAddTaxDialog}
          onClose={handleCloseAddTaxDialog}
          maxWidth="lg"
        >
          <DialogTitle>Add Tax Details</DialogTitle>
          <DialogContent>
            <div className="row">
              {selectedTaxes.length > 0 ? (
                selectedTaxes.map((property, index) => (
                  <div key={index}>
                    <br></br>

                    <Typography variant="h6">
                      Assessment Information - {property.zone}
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow
                          style={{
                            backgroundColor: "#f05b4d",
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
                            backgroundColor: "#f05b4d",
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
                      <>
                        <Table>
                          <TableHead>
                            <TableRow
                              style={{
                                backgroundColor: "#f05b4d",
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
                                Construction Type
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
                              <TableCell
                                style={{
                                  border: "2px solid black",
                                  textAlign: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                              >
                                Update Tax (in Rs)
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            {property.floorInformation.map(
                              (floor, floorIndex) => (
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
                                  <TableCell
                                    style={{
                                      border: "2px solid black",
                                      textAlign: "center",
                                    }}
                                  >
                                    <TextField
                                      variant="outlined"
                                      fullWidth
                                      value={taxData[floor.id] || ""}
                                      onChange={(e) =>
                                        handleAddTaxChange(e, floor.id)
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </>
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
                          backgroundColor: "#f05b4d",
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
                            Facility Details
                          </TableCell>
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
                            Facility Data
                          </TableCell>
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
                            Facility Tax (in Rs)
                          </TableCell>
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
                        <TableRow
                          key={property.prop_id}
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
                            Update Tax (in Rs)
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              label="Hoarding"
                              variant="outlined"
                              fullWidth
                              value={
                                facilityData[property.prop_id]?.hoardingtax ||
                                ""
                              }
                              onChange={(e) =>
                                handleAddFacilityTaxChange(
                                  e,
                                  property.prop_id,
                                  "hoardingtax"
                                )
                              }
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              label="Mobile Tower"
                              variant="outlined"
                              fullWidth
                              value={
                                facilityData[property.prop_id]
                                  ?.mobiletowertax || ""
                              }
                              onChange={(e) =>
                                handleAddFacilityTaxChange(
                                  e,
                                  property.prop_id,
                                  "mobiletowertax"
                                )
                              }
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              label="Head Room"
                              variant="outlined"
                              fullWidth
                              value={
                                facilityData[property.prop_id]?.headroomtax ||
                                ""
                              }
                              onChange={(e) =>
                                handleAddFacilityTaxChange(
                                  e,
                                  property.prop_id,
                                  "headroomtax"
                                )
                              }
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              label="OHT"
                              variant="outlined"
                              fullWidth
                              value={
                                facilityData[property.prop_id]?.ohttax || ""
                              }
                              onChange={(e) =>
                                handleAddFacilityTaxChange(
                                  e,
                                  property.prop_id,
                                  "ohttax"
                                )
                              }
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              label="Parking"
                              variant="outlined"
                              fullWidth
                              value={
                                facilityData[property.prop_id]?.parkingtax || ""
                              }
                              onChange={(e) =>
                                handleAddFacilityTaxChange(
                                  e,
                                  property.prop_id,
                                  "parkingtax"
                                )
                              }
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              border: "2px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              label="Ramp"
                              variant="outlined"
                              fullWidth
                              value={
                                facilityData[property.prop_id]?.ramptax || ""
                              }
                              onChange={(e) =>
                                handleAddFacilityTaxChange(
                                  e,
                                  property.prop_id,
                                  "ramptax"
                                )
                              }
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <br />
                    <br />
                  </div>
                ))
              ) : (
                <Typography>No tax details available</Typography>
              )}
              {/* <div className="col-12 col-sm-6">
              <label htmlFor="tax" className="form-label">
                Tax
              </label>
              <input
                type="text"
                className="form-control"
                id="tax"
                name="tax"
                value={newTax.tax}
                onChange={handleAddTaxChange}
              />
            </div> */}
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleCloseAddTaxDialog}
              style={{
                backgroundColor: "#f05b4d",
                color: "white",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTaxSubmitAll}
              style={{
                backgroundColor: "#f05b4d",
                color: "white",
              }}
            >
              Submit All
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </>
  );
};

export default Fad;