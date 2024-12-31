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
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';

function EditSadminVerifyProperties() {
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
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [selectedMapWard, setSelectedMapWard] = useState('');
  const [selectedGisInfo, setSelectedGisInfo] = useState('');
  const [gisIdSource, setGisIdSource] = useState('manual');
  const [review, setReview] = useState('');
  
  const wardMapOptions = [
    { value: '001', label: 'Ward 01', displayValue: '001' },
    { value: '014', label: 'Ward 14', displayValue: '014' },
    { value: '016', label: 'Ward 16', displayValue: '016' },
    { value: '035', label: 'Ward 35', displayValue: '035' },
    { value: '036', label: 'Ward 36', displayValue: '036' },
    { value: '041', label: 'Ward 41', displayValue: '041' }
  ];
  
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
      const submitData = {
        ...formData,
        review: review,
        sadmin_review_status: 1,
        floorData: floorData.map(floor => ({
          id: floor.id,
          floor: floor.floor,
          area_sqft: floor.area_sqft || '',
          occupancy: floor.occupancy || '',
          area_calculation: floor.area_calculation || '',
          percentage_used: floor.percentage_used || '',
          usage: floor.usage || '',
          tax: floor.tax || '0',
          prof_tax_no: floor.prof_tax_no || ''
        }))
      };

      console.log('Submitting data:', submitData);

      const response = await fetch('https://luisnellai.xyz/siraj/admin/update_verification_status.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        // After successful verification, update GIS IDs in localStorage
        await fetchGisIds();
        
        setSuccessMessage('Verification completed successfully!');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/sadmin-verification-list');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to complete verification');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      setErrorMessage(error.message || 'Failed to complete verification');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sadmin_verification_token');
    window.location.href = '/';
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

  const handleCloseMapDialog = () => {
    setOpenMapDialog(false);
    setSelectedMapWard('');
  };

  const gotomap = () => {
    setOpenMapDialog(true);
  };

  const handleWardSelect = () => {
    if (selectedMapWard) {
      const selectedWardOption = wardMapOptions.find(w => w.value === selectedMapWard);
      const wardPath = `/Gis_finder_ward_${selectedWardOption.displayValue}/index.html`;
      const mapWindow = window.open(wardPath, '_blank', 'width=1000,height=800,left=200,top=100');
      
      window.addEventListener('message', function(event) {
        if (event.data.type === 'GISID_SELECTED') {
          const selectedGISID = event.data.gisId;
          // Format the GIS ID with ward number and hyphen
          setFormData(prev => ({
            ...prev,
            gisId: selectedGISID
          }));
          setGisIdSource('map');
          setSelectedGisInfo(`Ward ${selectedGISID}`);
          setSuccessMessage(`Selected GIS ID: ${selectedGISID}`);
          setOpenSnackbar(true);
        }
      }, false);
      
      handleCloseMapDialog();
    }
  };

  // Add the fetchGisIds function
  const fetchGisIds = async () => {
    try {
      const response = await fetch('https://luisnellai.xyz/siraj/getGisIds.php', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Store surveyor submitted GIS IDs
        localStorage.setItem('surveyor_submitted_01_gisId', 
          JSON.stringify(data.surveyor_submitted.ward01)
        );
        localStorage.setItem('surveyor_submitted_36_gisId', 
          JSON.stringify(data.surveyor_submitted.ward36)
        );
        
        localStorage.setItem('surveyor_submitted_35_gisId', 
          JSON.stringify(data.surveyor_submitted.ward35)
        );
        

        // Store verified GIS IDs
        localStorage.setItem('verify_reviewed_01_gisId', 
          JSON.stringify(data.verified.ward01)
        );
        localStorage.setItem('verify_reviewed_36_gisId', 
          JSON.stringify(data.verified.ward36)
        );

        localStorage.setItem('verify_reviewed_35_gisId', 
          JSON.stringify(data.verified.ward35)
        );

        // Store admin verified GIS IDs
        localStorage.setItem('admin_reviewed_01_gisId', 
          JSON.stringify(data.admin_verified.ward01)
        );
        localStorage.setItem('admin_reviewed_36_gisId', 
          JSON.stringify(data.admin_verified.ward36)
        );

        localStorage.setItem('admin_reviewed_35_gisId', 
          JSON.stringify(data.admin_verified.ward35)
        );

        // Store super admin verified GIS IDs
        localStorage.setItem('sadmin_reviewed_01_gisId', 
          JSON.stringify(data.sadmin_verified.ward01)
        );
        localStorage.setItem('sadmin_reviewed_36_gisId', 
          JSON.stringify(data.sadmin_verified.ward36)
        );

        localStorage.setItem('sadmin_reviewed_35_gisId', 
          JSON.stringify(data.sadmin_verified.ward35)
        );

        // Return all data
        return {
          surveyorSubmitted: {
            ward01: data.surveyor_submitted.ward01,
            ward36: data.surveyor_submitted.ward36
          },
          verified: {
            ward01: data.verified.ward01,
            ward36: data.verified.ward36
          },
          adminVerified: {
            ward01: data.admin_verified.ward01,
            ward36: data.admin_verified.ward36
          },
          sadminVerified: {
            ward01: data.sadmin_verified.ward01,
            ward36: data.sadmin_verified.ward36
          }
        };
      } else {
        console.error('Failed to fetch GIS IDs:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error fetching GIS IDs:', error);
      return false;
    }
  };

  // Add the getGisIdsFromStorage helper function
  const getGisIdsFromStorage = (type, ward) => {
    try {
      const paddedWard = ward.padStart(3, '0'); // Convert ward number to 3 digits
      const key = `${type}_reviewed_${paddedWard}_gisId`;
      const storageKey = type === 'surveyor' ? 
        `surveyor_submitted_${ward}_gisId` : key;
      
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
      return [];
    } catch (error) {
      console.error(`Error getting ${type} GIS IDs for ward ${ward} from localStorage:`, error);
      return [];
    }
  };

  // Update the useEffect for initialization
  useEffect(() => {
    const initializeGisIds = async () => {
      const allGisIds = await fetchGisIds();
      
      // Define all ward numbers
      const wardNumbers = ['01', '14', '16', '35', '36', '41'];
      
      // Initialize GIS IDs for all wards
      wardNumbers.forEach(ward => {
        // Get surveyor submitted GIS IDs
        const surveyorGisIds = getGisIdsFromStorage('surveyor', ward);
        console.log(`Surveyor GIS IDs Ward ${ward}:`, surveyorGisIds);
        
        // Get verifier reviewed GIS IDs
        const verifiedGisIds = getGisIdsFromStorage('verify', ward);
        console.log(`Verified GIS IDs Ward ${ward}:`, verifiedGisIds);
        
        // Get admin reviewed GIS IDs
        const adminGisIds = getGisIdsFromStorage('admin', ward);
        console.log(`Admin Verified GIS IDs Ward ${ward}:`, adminGisIds);
        
        // Get super admin reviewed GIS IDs
        const sadminGisIds = getGisIdsFromStorage('sadmin', ward);
        console.log(`Super Admin Verified GIS IDs Ward ${ward}:`, sadminGisIds);
      });

      // Store all GIS IDs in localStorage for each ward
      if (allGisIds.success) {
        wardNumbers.forEach(ward => {
          const paddedWard = ward.padStart(3, '0'); // Ensure 3 digit format e.g. '001'
          
          // Store surveyor submitted GIS IDs
          localStorage.setItem(
            `surveyor_submitted_${ward}_gisId`,
            JSON.stringify(allGisIds.surveyorSubmitted[`ward${paddedWard}`] || [])
          );
          
          // Store verified GIS IDs
          localStorage.setItem(
            `verify_reviewed_${ward}_gisId`,
            JSON.stringify(allGisIds.verified[`ward${paddedWard}`] || [])
          );
          
          // Store admin verified GIS IDs
          localStorage.setItem(
            `admin_reviewed_${ward}_gisId`,
            JSON.stringify(allGisIds.adminVerified[`ward${paddedWard}`] || [])
          );
          
          // Store super admin verified GIS IDs
          localStorage.setItem(
            `sadmin_reviewed_${ward}_gisId`,
            JSON.stringify(allGisIds.sadminVerified[`ward${paddedWard}`] || [])
          );
        });
      }
    };

    initializeGisIds();
  }, []);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Super admin Verification
          </Typography>
          <Button color="inherit" onClick={gotomap}>
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
                <TextField
                  fullWidth
                  label="Building Name"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Door No"
                  name="doorNo"
                  value={formData.doorNo}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Review Comments"
                  name="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
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

      <Dialog 
        open={openMapDialog} 
        onClose={handleCloseMapDialog}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          style: {
            minHeight: '60vh',
            padding: '20px',
            borderRadius: '10px'
          }
        }}
      >
        <DialogTitle 
          sx={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            borderBottom: '1px solid #eee',
            padding: '20px'
          }}
        >
          Select Ward to View Map
        </DialogTitle>
        <DialogContent sx={{ padding: '40px 20px' }}>
          <Typography sx={{ mb: 3 }}>
            Please select a ward to view its corresponding map:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Ward</InputLabel>
            <Select
              value={selectedMapWard}
              onChange={(e) => setSelectedMapWard(e.target.value)}
              label="Ward"
              sx={{ 
                minHeight: '50px',
                fontSize: '16px'
              }}
            >
              {wardMapOptions.map((ward) => (
                <MenuItem 
                  key={ward.value} 
                  value={ward.value}
                  sx={{ 
                    fontSize: '16px',
                    padding: '15px'
                  }}
                >
                  {ward.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ 
          padding: '20px',
          borderTop: '1px solid #eee',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Button 
            onClick={handleCloseMapDialog} 
            color="secondary"
            variant="outlined"
            sx={{ 
              minWidth: '120px',
              height: '45px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWardSelect} 
            color="primary"
            variant="contained"
            disabled={!selectedMapWard}
            sx={{ 
              minWidth: '120px',
              height: '45px'
            }}
          >
            Open Map
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditSadminVerifyProperties;
