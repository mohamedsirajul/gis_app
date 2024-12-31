import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  CircularProgress,
  Snackbar,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';

function SurveyEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mapWindow, setMapWindow] = useState(null);
  const [billOptions, setBillOptions] = useState([]);
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [hasData, setHasData] = useState(true);
  const [floorData, setFloorData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    gisId: '',
    wardNo: '',
    streetName: '',
    doorNo: '',
    ownerName: '',
    mobileNo: '',
    buildingName: '',
    assessmentNo: '',
    areaofplot: '',
    Buildingusedas: '',
    Hoarding: '',
    MobileTower: '',
    property_ownership: '',
    buildingtype: '',
    zone: ''
  });

  // Function to open map in new window
  const openMap = () => {
    const mapUrl = `${window.location.origin}/Gis_finder/index.html`;
    const newWindow = window.open(
      mapUrl,
      'GISFinder',
      'width=1000,height=800,left=200,top=100'
    );
    setMapWindow(newWindow);
  };

  // Handle GIS ID selection from map
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'GISID_SELECTED') {
        const selectedGISID = event.data.gisId;
        setFormData(prev => ({
          ...prev,
          gisId: selectedGISID
        }));
        
        // Fetch data for the selected GIS ID
        fetchDataByGisId(selectedGISID);
        
        // Close the map window
        if (mapWindow) {
          mapWindow.close();
          setMapWindow(null);
        }
        
        setSuccessMessage('GIS ID selected from map!');
        setOpenSnackbar(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [mapWindow]);

  // Fetch survey data on component mount
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://yourapi.com/survey/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData(data.surveyData);
        } else {
          setErrorMessage('Failed to fetch survey data');
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error('Error fetching survey data:', error);
        setErrorMessage('Error loading survey data');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If area of plot changes, update the first floor's area_calculation
    if (name === 'areaofplot') {
      setFloorData(prevFloors => 
        prevFloors.map((floor, index) => 
          index === 0 
            ? { 
                ...floor, 
                area_calculation: value,
                // Recalculate area_sqft based on percentage
                area_sqft: (parseFloat(floor.percentage_used || 100) / 100 * parseFloat(value)).toString()
              }
            : floor
        )
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://yourapi.com/survey/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Survey updated successfully!');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/survey-list');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to update survey');
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      setErrorMessage(error.message || 'Failed to update survey');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('second_admin_token');
    navigate('/');
  };

  // Add this after your existing state declarations
  const fetchDataByGisId = async (gisId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://luisnellai.xyz/siraj/getbygisid.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gisId }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (!Array.isArray(data.properties) || data.properties.length === 0) {
          // Clear form data if no properties found
          setFormData(prev => ({
            ...prev,
            gisId: '',
            wardNo: '',
            streetName: '',
            doorNo: '',
            ownerName: '',
            mobileNo: '',
            buildingName: '',
            assessmentNo: ''
          }));
          setHasData(false);
          alert(`GIS ID ${gisId} has no survey data`);
          return;
        } else {
          setHasData(true);
        }

        if (data.properties.length > 1) {
          setBillOptions(data.properties);
          setOpenBillDialog(true);
        } else {
          handleBillSelection(data.properties[0]);
        }
      } else {
        setErrorMessage('Error fetching property data');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
      setErrorMessage('Error loading property data');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBillSelection = (propertyData) => {
    setFormData(prev => ({
      ...prev,
      wardNo: propertyData.Ward,
      streetName: propertyData.Street,
      doorNo: propertyData.DoorNo,
      ownerName: propertyData.Owner,
      mobileNo: propertyData.Mobile,
      buildingName: propertyData.BuildingName,
      assessmentNo: propertyData.AssessmentNo,
      areaofplot: propertyData.areaofplot,
      Buildingusedas: propertyData.Buildingusedas,
      Hoarding: propertyData.Hoarding,
      MobileTower: propertyData.MobileTower,
      property_ownership: propertyData.property_ownership,
      buildingtype: propertyData.buildingtype,
      zone: propertyData.zone
    }));
    
    if (propertyData.floors) {
      const updatedFloors = propertyData.floors.map((floor, index) => 
        index === 0 
          ? { ...floor, area_calculation: propertyData.areaofplot }
          : floor
      );
      setFloorData(updatedFloors);
      setHasData(true);
      setIsEditing(true);
    }
    
    setOpenBillDialog(false);
  };

  const handleFloorChange = (floorId, field, value) => {
    setFloorData(prevFloors => 
      prevFloors.map((floor, index) => {
        if (floor.id === floorId) {
          let updates = { ...floor, [field]: value };
          
          // If percentage_used changes, recalculate area_sqft
          if (field === 'percentage_used') {
            const percentage = parseFloat(value) || 0;
            const areaCalculation = parseFloat(floor.area_calculation) || 0;
            updates.area_sqft = ((percentage / 100) * areaCalculation).toString();
          }
          
          // If area_calculation changes, recalculate area_sqft
          if (field === 'area_calculation') {
            const percentage = parseFloat(floor.percentage_used) || 100;
            const areaCalculation = parseFloat(value) || 0;
            updates.area_sqft = ((percentage / 100) * areaCalculation).toString();
          }
          
          return updates;
        }
        return floor;
      })
    );
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Edit Survey
          </Typography>
          <Button color="inherit" onClick={openMap}>
            MAP
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="GIS ID"
                    name="gisId"
                    value={formData.gisId}
                    onChange={handleInputChange}
                    disabled
                    InputProps={{
                      endAdornment: formData.gisId && (
                        <Box component="span" sx={{ color: 'success.main', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                          ✓ From Map
                        </Box>
                      ),
                    }}
                  />
                  {/* <Button
                    variant="contained"
                    size="small"
                    onClick={openMap}
                    sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                  >
                    Select from Map
                  </Button> */}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ward No"
                  name="wardNo"
                  value={formData.wardNo}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Street Name"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Door No"
                  name="doorNo"
                  value={formData.doorNo}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile No"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Area of Plot"
                  name="areaofplot"
                  value={formData.areaofplot}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Building Used As"
                  name="Buildingusedas"
                  value={formData.Buildingusedas}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hoarding"
                  name="Hoarding"
                  value={formData.Hoarding}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Tower"
                  name="MobileTower"
                  value={formData.MobileTower}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Property Ownership"
                  name="property_ownership"
                  value={formData.property_ownership}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Building Type"
                  name="buildingtype"
                  value={formData.buildingtype}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  disabled={!hasData || !isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                {floorData.length > 0 && (
                  <Typography variant="h6" gutterBottom>
                    Floor Information
                  </Typography>
                )}
                {floorData.map((floor, index) => (
                  <Box key={floor.id} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Floor Number"
                          value={floor.floor !== null && floor.floor !== undefined ? floor.floor : ''}
                          onChange={(e) => handleFloorChange(floor.id, 'floor', e.target.value)}
                          disabled={!hasData || !isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Area (sq ft)"
                          value={floor.area_sqft || ''}
                          onChange={(e) => handleFloorChange(floor.id, 'area_sqft', e.target.value)}
                          disabled={!hasData || !isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Occupancy"
                          value={floor.occupancy || ''}
                          onChange={(e) => handleFloorChange(floor.id, 'occupancy', e.target.value)}
                          disabled={!hasData || !isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Usage"
                          value={floor.usage || ''}
                          onChange={(e) => handleFloorChange(floor.id, 'usage', e.target.value)}
                          disabled={!hasData || !isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Percentage Used"
                          value={floor.percentage_used || ''}
                          onChange={(e) => handleFloorChange(floor.id, 'percentage_used', e.target.value)}
                          disabled={!hasData || !isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Tax"
                          value={floor.tax || ''}
                          onChange={(e) => handleFloorChange(floor.id, 'tax', e.target.value)}
                          disabled={!hasData || !isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Area Calculation"
                          value={floor.area_calculation || ''}
                          onChange={(e) => handleFloorChange(floor.id, 'area_calculation', e.target.value)}
                          disabled={index === 0 || !hasData || !isEditing}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsEditing(true)}
                      disabled={!hasData || floorData.length === 0}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading || !hasData || floorData.length === 0}
                      startIcon={loading && <CircularProgress size={20} />}
                    >
                      Update Survey
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setFormData({
                        gisId: '',
                        wardNo: '',
                        streetName: '',
                        doorNo: '',
                        ownerName: '',
                        mobileNo: '',
                        buildingName: '',
                        assessmentNo: '',
                        areaofplot: '',
                        Buildingusedas: '',
                        Hoarding: '',
                        MobileTower: '',
                        property_ownership: '',
                        buildingtype: '',
                        zone: ''
                      });
                      setFloorData([]);
                      setHasData(false);
                      setIsEditing(false);
                    }}
                    startIcon={<ClearIcon />}
                  >
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity={successMessage ? "success" : "error"}
        >
          {successMessage || errorMessage}
        </MuiAlert>
      </Snackbar>

      <Dialog open={openBillDialog} onClose={() => setOpenBillDialog(false)}>
        <DialogTitle>Select Bill Number</DialogTitle>
        <DialogContent>
          <List>
            {billOptions.map((property) => (
              <ListItem 
                button 
                key={property.AssessmentNo}
                onClick={() => handleBillSelection(property)}
              >
                <ListItemText 
                  primary={`Bill No: ${property.AssessmentNo}`}
                  secondary={`Owner: ${property.Owner}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBillDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SurveyEdit;
