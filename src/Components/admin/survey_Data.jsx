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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from '@mui/icons-material/Edit';

const ViewSurvey = () => {
  const { user_id } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [openGisDialog, setOpenGisDialog] = useState(false);
  const [selectedGisId, setSelectedGisId] = useState('');
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [newGisId, setNewGisId] = useState('');
  const [showNewGisInput, setShowNewGisInput] = useState(false);
  const [allGisIds, setAllGisIds] = useState([]);

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
        console.log(data);
        setProperties(data.properties || []); // Ensure data.properties is defined or default to an empty array
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user_id]);
  const handleBack = () => {
    window.location.href = "/users";
  };

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

  const handleOpenGisDialog = () => {
    setAllGisIds(getUniqueGisIds());
    setSelectedGisId('');
    setSelectedAssessments([]);
    setOpenGisDialog(true);
  };

  const handleCloseGisDialog = () => {
    setOpenGisDialog(false);
    setSelectedAssessments([]);
    setNewGisId('');
    setShowNewGisInput(false);
  };

  const handleAssessmentChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setSelectedAssessments(
        selectedAssessments.length === getAssessmentsByGisId(selectedGisId).length
          ? []
          : getAssessmentsByGisId(selectedGisId)
      );
      return;
    }
    setSelectedAssessments(value);
  };

  const getAssessmentsByGisId = (gisId) => {
    return properties
      .filter(property => property.Gisid === gisId)
      .map(property => property.AssessmentNo);
  };

  const handleUpdateGisId = async () => {
    try {
      const response = await fetch('https://luisnellai.xyz/siraj/updateGisId.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldGisId: selectedGisId,
          newGisId: newGisId,
          assessmentNumbers: selectedAssessments
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update GIS ID');
      }

      const result = await response.json();
      alert(result.message);
      handleCloseGisDialog();
      // Refresh the data
      window.location.reload();
    } catch (error) {
      alert('Error updating GIS ID: ' + error.message);
    }
  };

  const getUniqueGisIds = () => {
    const uniqueGisIds = [...new Set(properties.map(property => property.Gisid))];
    return uniqueGisIds.filter(id => id); // Remove any null/empty values
  };

  const handleGisIdSelect = (event) => {
    setSelectedGisId(event.target.value);
    setSelectedAssessments([]);
    setShowNewGisInput(false);
    setNewGisId('');
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Survey Data</Typography>
          <Button
            color="inherit"
            startIcon={<EditIcon />}
            onClick={handleOpenGisDialog}
          >
            Edit GIS ID
          </Button>
        </Toolbar>
      </AppBar>
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
      <Dialog open={openGisDialog} onClose={handleCloseGisDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit GIS ID</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select GIS ID</InputLabel>
            <Select
              value={selectedGisId}
              onChange={handleGisIdSelect}
              input={<OutlinedInput label="Select GIS ID" />}
            >
              {allGisIds.map((gisId) => (
                <MenuItem key={gisId} value={gisId}>
                  {gisId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedGisId && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Assessment Numbers</InputLabel>
              <Select
                multiple
                value={selectedAssessments}
                onChange={handleAssessmentChange}
                input={<OutlinedInput label="Select Assessment Numbers" />}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="all">
                  <Checkbox
                    checked={selectedAssessments.length === getAssessmentsByGisId(selectedGisId).length}
                    indeterminate={
                      selectedAssessments.length > 0 &&
                      selectedAssessments.length < getAssessmentsByGisId(selectedGisId).length
                    }
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>
                {getAssessmentsByGisId(selectedGisId).map((assessment) => (
                  <MenuItem key={assessment} value={assessment}>
                    <Checkbox checked={selectedAssessments.indexOf(assessment) > -1} />
                    <ListItemText primary={assessment} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedAssessments.length > 0 && !showNewGisInput && (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => setShowNewGisInput(true)}
            >
              Enter New GIS ID
            </Button>
          )}
          
          {showNewGisInput && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New GIS ID</InputLabel>
              <OutlinedInput
                value={newGisId}
                onChange={(e) => setNewGisId(e.target.value)}
                label="New GIS ID"
              />
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGisDialog}>Cancel</Button>
          {showNewGisInput && newGisId && (
            <Button onClick={handleUpdateGisId} variant="contained">
              Update GIS ID
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewSurvey;
