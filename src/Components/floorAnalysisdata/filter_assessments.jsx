    import React, { useEffect, useState } from "react";
    import { useParams } from "react-router-dom";
    import {
    Container,
    CircularProgress,
    Alert,
    AppBar,
    Toolbar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CardMedia,
    Typography,
    } from "@mui/material";
    import ArrowBackIcon from "@mui/icons-material/ArrowBack";
    import VisibilityIcon from "@mui/icons-material/Visibility";
    import { CSVLink } from "react-csv";
    import GetAppIcon from '@mui/icons-material/GetApp';
import { Margin } from "@mui/icons-material";

    const FilterAd = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [dialogTitle, setDialogTitle] = useState("");

    useEffect(() => {
        const fetchProperties = async () => {
        try {
            const response = await fetch(
                "https://luisnellai.xyz/siraj/admin/getAllassesmentInfo.php"
            );
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (data.status === "success") {
                setProperties(data.properties || []);
            } else {
                throw new Error(data.message || "Failed to fetch data");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
        };

        fetchProperties();
    }, []);
    const handleBack = () => {
        window.location.href = "/users";
    };


    const generateAllCSVData = (data, columns, nestedKey = null) => {
        let result = [];
        data.forEach(item => {
          const formattedDoorNo = item.DoorNo ? item.DoorNo.replace('-', '/') : '';
          
          if (nestedKey && item[nestedKey]) {
            item[nestedKey].forEach(nestedItem => {
              const row = { 
                'Assessment No': item.AssessmentNo,
                'Door No': formattedDoorNo,
                'Building Type': item.buildingtype || '',
              }; 
              columns.forEach(column => {
                if (item.hasOwnProperty(column.key)) {
                  row[column.label] = item[column.key];
                }
                
                if (nestedItem.hasOwnProperty(column.key)) {
                  if (column.key === 'occupancy') {
                    row['Construction Type'] = nestedItem[column.key];
                  } else if (column.key === 'prof_tax_no') {
                    row['Prof Tax No'] = nestedItem[column.key] || '';
                  } else {
                    row[column.label] = nestedItem[column.key];
                  }
                }
              });
              result.push(row);
            });
          } else {
            const row = { 
              'Assessment No': item.AssessmentNo,
              'Door No': formattedDoorNo,
              'Building Type': item.buildingtype || '',
            };
            columns.forEach(column => {
              row[column.label] = item[column.key];
            });
            result.push(row);
          }
        });
        return result;
    };

    const generateCSVData = (data, columns, nestedKey = null) => {
        let result = [];
        data.forEach(item => {
          if (nestedKey && item[nestedKey]) {
            item[nestedKey].forEach(nestedItem => {
              const row = { 'Assessment No': item.AssessmentNo };
              columns.forEach(column => {
                // Special handling for occupancy field to use "Construction Type" label
                if (column.key === 'occupancy') {
                  row['Building Type'] = nestedItem[column.key];
                } else if (column.key === 'prof_tax_no') {
                  row['Prof Tax No'] = nestedItem[column.key] || '';
                } else {
                  row[column.label] = nestedItem[column.key];
                }
              });
              result.push(row);
            });
          } else {
            const row = { 'Assessment No': item.AssessmentNo };
            columns.forEach(column => {
              row[column.label] = item[column.key];
            });
            result.push(row);
          }
        });
        return result;
    };


    const AllpropertyColumns = [
        { label: "Ward Name", key: "Ward" },
        { label: "Street Name", key: "Street" },
        { label: "Ownership", key: "property_ownership" },
        { label: "Building Type", key: "buildingtype" },
        { label: "GIS ID", key: "Gisid" },
        { label: "Assessment No", key: "AssessmentNo" },
        { label: "Old Assessment No", key: "oldAssessmentNo" },
        { label: "Plot Area", key: "areaofplot" },
        { label: "Door No", key: "DoorNo" },
        { label: "Owner", key: "Owner" },
        { label: "Mobile", key: "Mobile" },
        { label: "Address 1", key: "address1" },
        { label: "Address 2", key: "address2" },
        { label: "Total Floor", key: "TotalFloor" },
      ];
    const propertyColumns = [
        { label: "Ward Name", key: "Ward" },
        { label: "Street Name", key: "Street" },
        { label: "Ownership", key: "property_ownership" },
        { label: "Building Type", key: "buildingtype" },
        { label: "GIS ID", key: "Gisid" },
        { label: "Assessment No", key: "AssessmentNo" },
        { label: "Old Assessment No", key: "oldAssessmentNo" },
        { label: "Plot Area", key: "areaofplot" },
        { label: "Door No", key: "DoorNo" },
        { label: "Owner", key: "Owner" },
        { label: "Mobile", key: "Mobile" },
        { label: "Address 1", key: "address1" },
        { label: "Address 2", key: "address2" },
        { label: "Total Floor", key: "TotalFloor" },
    ];

  const AllfacilityColumns = [
    { label: "Ward Name", key: "Ward" },
    { label: "Street Name", key: "Street" },
    { label: "Ownership", key: "property_ownership" },
    { label: "Building Type", key: "buildingtype" },
    { label: "GIS ID", key: "Gisid" },
    { label: "Assessment No", key: "AssessmentNo" },
    { label: "Old Assessment No", key: "oldAssessmentNo" },
    { label: "Plot Area", key: "areaofplot" },
    { label: "Door No", key: "DoorNo" },
    { label: "Owner", key: "Owner" },
    { label: "Mobile", key: "Mobile" },
    { label: "Address 1", key: "address1" },
    { label: "Address 2", key: "address2" },
    { label: "Total Floor", key: "TotalFloor" },
    { label: "Hoarding", key: "Hoarding" },
    { label: "Mobile Tower", key: "MobileTower" },
    { label: "Ramp", key: "ramp" },
    { label: "Area of Plot", key: "areaofplot" },
    { label: "Head Rooms", key: "headRooms" },
    { label: "Lift Rooms", key: "liftRooms" },
    { label: "OHT", key: "oht" },
    { label: "Parking", key: "parking" },
  ];
  const facilityColumns = [
    { label: "Hoarding", key: "Hoarding" },
    { label: "Mobile Tower", key: "MobileTower" },
    { label: "Ramp", key: "ramp" },
    { label: "Area of Plot", key: "areaofplot" },
    { label: "Head Rooms", key: "headRooms" },
    { label: "Lift Rooms", key: "liftRooms" },
    { label: "OHT", key: "oht" },
    { label: "Parking", key: "parking" },
  ];

  const AllfloorColumns = [
    { label: "Ward Name", key: "Ward" },
    { label: "Street Name", key: "Street" },
    { label: "Ownership", key: "property_ownership" },
    { label: "Building Type", key: "occupancy" },
    { label: "GIS ID", key: "Gisid" },
    { label: "Assessment No", key: "AssessmentNo" },
    { label: "Old Assessment No", key: "oldAssessmentNo" },
    { label: "Plot Area", key: "areaofplot" },
    { label: "Door No", key: "DoorNo" },
    { label: "Owner", key: "Owner" },
    { label: "Mobile", key: "Mobile" },
    { label: "Address 1", key: "address1" },
    { label: "Address 2", key: "address2" },
    { label: "Total Floor", key: "TotalFloor" },
    { label: "Area", key: "area" },
    { label: "Establishment", key: "establishment" },
    { label: "Establishment Name", key: "establishmentName" },
    { label: "Flat No", key: "flatNo" },
    { label: "Floor", key: "floor" },
    { label: "Building Type", key: "occupancy" },
    { label: "Usage", key: "usage" },
    { label: "Prof Tax No", key: "prof_tax_no" },
  ];
  const floorColumns = [
    { label: "Area", key: "area" },
    { label: "Establishment", key: "establishment" },
    { label: "Establishment Name", key: "establishmentName" },
    { label: "Flat No", key: "flatNo" },
    { label: "Floor", key: "floor" },
    { label: "Building Type", key: "occupancy" },
    { label: "Usage", key: "usage" },
    { label: "Prof Tax No", key: "prof_tax_no" },
  ];
    const handleOpenDialog = (title, content) => {
        setDialogTitle(title);
        setDialogContent(content);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogContent(null);
        setDialogTitle("");
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    return (
        <>
        <AppBar position="static" >
            <Toolbar style={{ backgroundColor: "#eb3f2f" }}>
            <IconButton edge="start" color="inherit" onClick={handleBack}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Assessments Information</Typography>
            </Toolbar>
        </AppBar>
        <Container>{
            <>
            <br />

               <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table sx={{ minWidth: 650, borderCollapse: "collapse" }} aria-label="building-data-table">
        <TableHead>
            <TableRow>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>S.No</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Ward Name</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Street Name</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Ownership</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Building Type</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>GIS ID</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>AssessmentNo</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>oldAssessmentNo</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Plt Area(in sq.ft)</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Door Num</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Owner Name</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Mobile</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Address</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Total Floors</TableCell>
            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Actions</TableCell>

            </TableRow>
        </TableHead>
        <TableBody>
            {properties.map((property, index) => (
            <TableRow key={index}>
                <TableCell sx={{ border: "2px solid black" }}>{index + 1}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.Ward}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.Street}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.property_ownership}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.buildingtype}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.Gisid}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.AssessmentNo}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.oldAssessmentNo}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.areaofplot}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.DoorNo}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.Owner}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.Mobile}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.address1}, {property.address2}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>{property.TotalFloor}</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#eb3f2f" }}
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                    handleOpenDialog(
                        <>
                        <h3 style={{textAlign:"center"}}>Property Information</h3>
                        <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
                        <TableHead>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>S.No</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Ward Name</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Street Name</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Ownership</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Building Type</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>GIS ID</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>AssessmentNo</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>oldAssessmentNo</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Plt Area</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Door Num</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Owner Name</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Mobile</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Address</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Total Floors</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={index}>
                                <TableCell sx={{ border: "2px solid black" }}>{index + 1}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.Ward}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.Street}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.property_ownership}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.buildingtype}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.Gisid}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.AssessmentNo}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.oldAssessmentNo}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.areaofplot}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.DoorNo}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.Owner}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.Mobile}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.address1}, {property.address2}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{property.TotalFloor}</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                        <CSVLink
                        data={generateCSVData([property], propertyColumns)}
                        filename={`property_${property.AssessmentNo}.csv`}
                        className="btn"
                        style={{
                            backgroundColor: "#eb3f2f",
                            marginTop: "10px",
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'white',
                            padding: '6px 16px',
                            textDecoration: 'none'
                        }}
                        >
                        <GetAppIcon style={{ marginRight: '8px' }} />
                        Download CSV
                        </CSVLink>
                        </>
                    )
                    }
                >
                  ViewProperty
                </Button>
                <br></br>
                <br></br>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#eb3f2f" }}
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                    handleOpenDialog(
                        "Floor Information",
                        <>
                        <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
                        <TableHead>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Area</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Establishment</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Establishment Name</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Flat No</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Floor</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Building Type</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Usage</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Prof Tax No</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {property.floorInformation.map(
                            (floor, floorIndex) => (
                                <TableRow key={floorIndex}>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.area}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.establishment}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.establishmentName}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.flatNo}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.floor}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.occupancy}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.usage}</TableCell>
                                <TableCell sx={{ border: "2px solid black" }}>{floor.prof_tax_no || '-'}</TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                        </Table>
                        <CSVLink
                        data={generateCSVData([property], floorColumns, 'floorInformation')}
                        filename={`floor_${property.AssessmentNo}.csv`}
                        className="btn"
                        style={{
                            backgroundColor: "#eb3f2f",
                            marginTop: "10px",
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'white',
                            padding: '6px 16px',
                            textDecoration: 'none'
                        }}
                        >
                        <GetAppIcon style={{ marginRight: '8px' }} />
                        Download CSV
                        </CSVLink>     
                        </>         
                    )
                    }
                >
                    ViewFloor
                </Button>
                <br></br>
                <br></br>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#eb3f2f" }}
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                    handleOpenDialog(
                        "Facility Details",
                        <DialogContentText>

                    <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
                        <TableHead>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Facility</TableCell>
                            <TableCell sx={{ border: "2px solid black", backgroundColor: "#eb3f2f", color: "white" }}>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Hoarding:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.Hoarding}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Mobile Tower:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.MobileTower}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Ramp:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.ramp}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Area of Plot:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.areaofplot}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Head Rooms:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.headRooms}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Lift Rooms:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.liftRooms}</TableCell>
                            </TableRow>
                            {/* <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Location:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.location}</TableCell>
                            </TableRow> */}
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>OHT:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.oht}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell sx={{ border: "2px solid black" }}><strong>Parking:</strong></TableCell>
                            <TableCell sx={{ border: "2px solid black" }}>{property.parking}</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                        <CSVLink
                        data={generateCSVData([property], facilityColumns)}
                        filename={`facility_${property.AssessmentNo}.csv`}
                        className="btn"
                        style={{
                            backgroundColor: "#eb3f2f",
                            marginTop: "10px",
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'white',
                            padding: '6px 16px',
                            textDecoration: 'none'
                        }}
                        >
                        <GetAppIcon style={{ marginRight: '8px' }} />
                        Download CSV
                        </CSVLink>   
                        </DialogContentText>
                    )
                    }
                >
                    ViewFacility
                </Button>
                <br /><br />
                <Button
                variant="contained"
                color="primary"
                startIcon={<VisibilityIcon />}
                style={{ backgroundColor: "#eb3f2f" }}
                onClick={() =>
                handleOpenDialog(
                    "View Image",
                    <CardMedia
                    component="img"
                    height="400"
                    image={property.image_url}
                    alt={property.BuildingName}
                    />
                )
                }
            >
                View_Image
            </Button>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
                </TableContainer>
                <div style={{ marginTop: 0 }}>
                <CSVLink
            data={generateAllCSVData(properties, AllpropertyColumns)}
            filename={"all_properties.csv"}
            className="btn"
            style={{
                backgroundColor: "#eb3f2f",
                marginTop: "10px",
                marginLeft:"20px",
                display: 'inline-flex',
                alignItems: 'center',
                color: 'white',
                padding: '6px 16px',
                textDecoration: 'none'
            }}
            >
            <GetAppIcon style={{ marginRight: '8px' }} />
            Download All Property
          </CSVLink>
          <CSVLink
            data={generateAllCSVData(properties, AllfacilityColumns, "facilities")}
            filename={"all_facilities.csv"}
            className="btn"
            style={{
                backgroundColor: "#eb3f2f",
                marginTop: "10px",
                marginLeft:"20px",

                display: 'inline-flex',
                alignItems: 'center',
                color: 'white',
                padding: '6px 16px',
                textDecoration: 'none'
            }}
            >            
            <GetAppIcon style={{ marginRight: '8px' }} />
            Download All Facility
          </CSVLink>
          <CSVLink
            data={generateAllCSVData(properties, AllfloorColumns, 'floorInformation')}
            filename={"all_floors.csv"}            
            className="btn"
            style={{
                backgroundColor: "#eb3f2f",
                marginTop: "10px",
                marginLeft:"20px",

                display: 'inline-flex',
                alignItems: 'center',
                color: 'white',
                padding: '6px 16px',
                textDecoration: 'none'
            }}
            >
            <GetAppIcon style={{ marginRight: '8px' }} />
            Download All Floor
          </CSVLink>
        </div>
            </>
            }
        </Container>
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>{dialogContent}</DialogContent>
            <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
                Close
            </Button>
            </DialogActions>
        </Dialog>
        </>
    );
    };

    export default FilterAd;
