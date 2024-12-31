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

const SViewSurvey = () => {
  const { user_id } = useParams();
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
          `https://luisnellai.xyz/siraj/getallbuildingdata.php/${user_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProperties(data.properties || []); // Ensure data.properties is defined or default to an empty array
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user_id]);

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
      <Container>
        {properties.length === 0 ? (
          <Alert severity="info">
            No properties found for user ID {user_id}
          </Alert>
        ) : (
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="building-data-table">
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Ward_Name</TableCell>
                  <TableCell>Street_Name</TableCell>
                  <TableCell>Ownership</TableCell>
                  <TableCell>B_Type</TableCell>
                  <TableCell>GIS_ID</TableCell>
                  <TableCell>AssessmentNo</TableCell>
                  <TableCell>oldAssessmentNo</TableCell>
                  <TableCell>Plt_Area</TableCell>
                  <TableCell>Door_Num</TableCell>
                  <TableCell>Owner Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Address</TableCell>
                  {/* <TableCell>Usage</TableCell> */}
                  <TableCell>Total Floors</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{property.Ward}</TableCell>
                    <TableCell>{property.Street}</TableCell>
                    <TableCell>{property.property_ownership}</TableCell>
                    <TableCell>{property.buildingtype}</TableCell>
                    <TableCell>{property.Gisid}</TableCell>
                    <TableCell>{property.AssessmentNo}</TableCell>
                    <TableCell>{property.oldAssessmentNo}</TableCell>
                    <TableCell>{property.areaofplot}</TableCell>
                    <TableCell>{property.DoorNo}</TableCell>
                    <TableCell>{property.Owner}</TableCell>
                    <TableCell>{property.Mobile}</TableCell>
                    <TableCell>
                      {property.address1}, {property.address2}
                    </TableCell>
                    {/* <TableCell>{property.usage}</TableCell> */}
                    <TableCell>{property.TotalFloor}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          handleOpenDialog(
                            "Floor Information",
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Area</TableCell>
                                  <TableCell>Establishment</TableCell>
                                  <TableCell>Establishment Name</TableCell>
                                  <TableCell>Flat No</TableCell>
                                  <TableCell>Floor</TableCell>
                                  <TableCell>Occupancy</TableCell>
                                  <TableCell>Usage</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {property.floorInformation.map(
                                  (floor, floorIndex) => (
                                    <TableRow key={floorIndex}>
                                      <TableCell>{floor.area}</TableCell>
                                      <TableCell>
                                        {floor.establishment}
                                      </TableCell>
                                      <TableCell>
                                        {floor.establishmentName}
                                      </TableCell>
                                      <TableCell>{floor.flatNo}</TableCell>
                                      <TableCell>{floor.floor}</TableCell>
                                      <TableCell>{floor.occupancy}</TableCell>
                                      <TableCell>{floor.usage}</TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          )
                        }
                      >
                        Floor
                      </Button>
                      <br></br>
                      <br></br>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          handleOpenDialog(
                            "Facility Details",
                            <DialogContentText>
                              <strong>Hoarding:</strong> {property.Hoarding}
                              <br />
                              <strong>Mobile Tower:</strong>{" "}
                              {property.MobileTower}
                              <br />
                              <strong>Ramp:</strong> {property.ramp}
                              <br />
                              <strong>Area of Plot:</strong>{" "}
                              {property.areaofplot}
                              <br />
                              <strong>Head Rooms:</strong> {property.headRooms}
                              <br />
                              <strong>Lift Rooms:</strong> {property.liftRooms}
                              <br />
                              <strong>Location:</strong> {property.location}
                              <br />
                              <strong>OHT:</strong> {property.oht}
                              <br />
                              <strong>Parking:</strong> {property.parking}
                            </DialogContentText>
                          )
                        }
                      >
                        Facility
                      </Button>
                      <br></br>
                      <br></br>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
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
        )}
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

export default SViewSurvey;