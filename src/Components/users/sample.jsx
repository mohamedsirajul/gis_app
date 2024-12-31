import React, { useState, useEffect } from "react";
import "./PropertyDetails.css";
import { Container, Row, Col } from "react-bootstrap";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@mui/material"; // Import Autocomplete

import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Paper,
  Button,
  Button as MuiButton,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Snackbar,Dialog, DialogActions, DialogContent, DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
// const navigate = useNavigate();

const buildingTypeOptions = [
  // "Super Structure",
  // "Special Building",
  // "Vacant Land",
  // "Independent Building",
  // "Flats in Multi Storied Building",
  // "Central Government 33%",
  // "Central Government 75%",
  // "State Government",
  // "Cell Phone Tower",
  // "Cinema Theater",
  // "Hospital",
  // "Hotel / Lodging House",
  // "Kalyana Mandapam",
  // "Educational Institution",
  // "Central Government 50%",
  // "Flat",
  // "Hostel",
    "Independent Building",
    "Government Property",
    "Cinema Theatre" ,
    "Education Institution",
    "Hospital" ,
    "Restaurant / Hotel" ,
    "Lodges / Residency / PG Hotel" ,
    "Shopping Mall" ,
    "Religious Structure"  ,
    "God own / Warehouse",
    "Vacant land"
];

const buildingUsedAsOptions = [
  // "Mixed",
  // "Residential",
  // "Commercial",
  // "Others",
  // "Vacant Land",
  "Permanent",  
    "Semi-Permanent",  
    "Shed",  
    "Vacant Land",  
    "Under Construction"

];

const PROPERTY_OWNERSHIP = [
  // "Mixed",
  // "Residential",
  // "Commercial",
  // "Others",
  // "Vacant Land",
  "Residence",  
  "Commercial",  
  "Mixed",  
  "Vacant Land",  
  "Industrials",  
  "Education Institutions",  
  "Special Type",  
  "Government Building",  
  "Vacant Land",  
  "Others"   

];

const FloorusageOptions = [
  "Mixed",
  "Residential",
  "Commercial",
  "Others",
  "Vacant Land",
];
const NoOfFloor = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const FloorOccupancy = ["Owner", "Tenent"];
function PropertyDetails() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [wardOptions, setWardOptions] = useState([]);
  const [streetOptions, setStreetOptions] = useState([]);
  const [assessmentOptions, setAssessmentOptions] = useState([]);
  const [OwnerOptions, setOwnerOptions] = useState([]);

  //location details
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");

  //Property Information
  const [selectedPROPERTY_OWNERSHIP, setselectedPROPERTY_OWNERSHIP] =
    useState("");
  const [selectedbuildingTypeOptions, setbuildingTypeOptions] = useState("");
  const [selectedBillNo, setSelectedBillNo] = useState("");
  const [selectedDoorNo, setSelectedDoorNo] = useState("");
  const [Gisid, setGisId] = useState("");
  const [selectedBuildingUsedAs, setSelectedBuildingUsedAs] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [BuildingName, setBuildingName] = useState("");
  const [TotalFloor, setTotalFloor] = useState("");
  const [selectedAreaofplot, setselectedAreaofplot] = useState("");
  const [selectedMobile, setSelectedMobile] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [billCount, setBillCount] = useState(1); // Default to 1 form
  const [status, setStatus] = useState('');

  const [propdata, setPropData] = useState([
    // Array of data objects to manage each field
    {
      selectedBillNo: '',
      selectedWard: '',
      selectedStreet: '',
      selectedDoorNo: '',
      selectedBuildingUsedAs: '',
      selectedOwner: '',
      buildingName: '',
      totalFloor: '',
      selectedAreaofplot: '',
      selectedMobile: ''
    }
  ]);


  const [assmtNo, setassmtNo] = useState("");
  const [OldassmtNo, setOldassmtNo] = useState("");
  const [usagename, setusagename] = useState("");

  //Address Details
  const [address1, setAdress1] = useState("");
  const [address2, setAdress2] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocationn] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  //Floor Information
  const [tradeDataOption, settradeData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [floorInformation, setFloorInformation] = useState([
    {
      id: 1,
      floor: "",
      area: "",
      usage: "",
      occupancy: "",
      flatNo: "",
      establishment: "",
      establishmentName: "",
    },
  ]);

  //Facility Details
  const [selectedHoarding, setSelectedHoarding] = useState("");
  const [selectedMobileTower, setSelectedMobileTower] = useState("");
  const [headRooms, setHeadRooms] = useState("");
  const [liftRooms, setLiftRooms] = useState("");
  const [parking, setParking] = useState("");
  const [ramp, setRamp] = useState("");
  const [oht, setOht] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  //loadiing
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const steps = [
    // "Location Details",
    "Property Info",
    // "Address Details",
    "Floor Info",
    "Facility Details",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleAddForms = (count) => {
    const newForms = Array.from({ length: count }, () => ({
      selectedBillNo: '',
      selectedWard: '',
      selectedStreet: '',
      selectedDoorNo: '',
      selectedBuildingUsedAs: '',
      selectedOwner: '',
      buildingName: '',
      totalFloor: '',
      selectedAreaofplot: '',
      selectedMobile: ''
    }));
    setPropData(newForms);
  };


  const addFloorInformation = () => {
    const newId = floorInformation.length + 1;
    setFloorInformation([
      ...floorInformation,
      {
        id: newId,
        floor: "",
        area: "",
        usage: "",
        occupancy: "",
        flatNo: "",
        establishment: "",
        establishmentName: "",
      },
    ]);
  };

  const handleFloorChange = (id, event) => {
    const updatedFloorInfo = floorInformation.map((item) =>
      item.id === id
        ? { ...item, [event.target.name]: event.target.value }
        : item
    );
    setFloorInformation(updatedFloorInfo);
  };

  const handleUsageChange = (id, e) => {
    const { value } = e.target;
    const updatedFloors = floorInformation.map((floor) =>
      floor.id === id ? { ...floor, usage: value } : floor
    );
    setFloorInformation(updatedFloors);
  };

  const filterOptions = (inputValue) => {
    if (inputValue.trim() === "") {
      setFilteredOptions(tradeDataOption);
    } else {
      const filtered = tradeDataOption.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  const deleteFloorInformation = (id) => {
    const updatedFloorInfo = floorInformation.filter((item) => item.id !== id);
    setFloorInformation(updatedFloorInfo);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (selectedBillNo) {
      fetch("https://luisnellai.xyz/siraj/getbybillno.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billnum: selectedBillNo }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSelectedDoorNo(data.NewDoorNo);
          setSelectedOwner(data.Owner_name);
          setselectedAreaofplot(data.PlotArea);
          setSelectedMobile(data.Mobileno);
          setSelectedZone(data.zone);
          setassmtNo(data.AssesmentNo);
          setOldassmtNo(data.OldAssesmentNo);
          setusagename(data.usagename);
        })
        .catch((error) => {
          console.error("Error sending POST request:", error);
        });
    }
  }, [selectedBillNo]);

  const user_id = localStorage.getItem("user_id");
  // console.log(user_id);
  useEffect(() => {
    fetch(`https://luisnellai.xyz/siraj/admin/get_assigned_task.php/${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
        const uniqueWards = [...new Set(data.map((item) => item.WardName))];
        setWardOptions(uniqueWards);

        const ownerNames = data.map((item) => item.Owner_name);
        setOwnerOptions(ownerNames);      
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    fetch("https://luisnellai.xyz/siraj/get_trade.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((trade_data) => {
        // console.log(trade_data);
        const descriptions = trade_data.map((item) => item.description);
        settradeData(descriptions);
        setFilteredOptions(descriptions); // Initialize filtered options with all options

        // console.log(descriptions);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedWard) {
      const streets = data
        .filter((item) => item.WardName === selectedWard)
        .map((item) => item.StreetName);
      const uniqueStreets = [...new Set(streets)];
      setStreetOptions(uniqueStreets);
      // setSelectedStreet("");
      // setAssessmentOptions([]);
    }
  }, [selectedWard, data]);

  useEffect(() => {
    if (selectedStreet) {
      const assessments = data
        .filter((item) => item.StreetName === selectedStreet)
        .map((item) => item.AssesmentNo);
      setAssessmentOptions(assessments);
    } else {
      // Show all AssesmentNo if no street is selected
      const allAssessments = data.map((item) => item.AssesmentNo);
      setAssessmentOptions(allAssessments);
    }
  }, [selectedStreet, data]);

  // useEffect(() => {
  //   if (selectedStreet) {
  //     const assessments = data
  //       .filter((item) => item.StreetName === selectedStreet)
  //       .map((item) => item.AssesmentNo);
  //     setAssessmentOptions(assessments);
  //   }
  // }, [selectedStreet, data]);


  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return selectedStreet !== "" && selectedWard !== "";
      // case 1:
      //   return (
      //     selectedBillNo !== "" &&
      //     selectedBuildingUsedAs !== "" &&
      //     selectedPROPERTY_OWNERSHIP !== "" &&
      //     Gisid !== "" &&
      //     selectedbuildingTypeOptions !== "" &&
      //     selectedDoorNo !== "" &&
      //     selectedOwner !== "" &&
      //     selectedAreaofplot !== "" &&
      //     selectedMobile !== "" &&
      //     BuildingName !== "" &&
      //     TotalFloor !== ""
      //   );
      // case 2:
      //   return (
      //     address1 !== "" &&
      //     address2 !== "" &&
      //     area !== "" &&
      //     location !== "" &&
      //     city !== "" &&
      //     state !== "" &&
      //     pinCode !== ""
      //   );
      // case 3:
      //   return floorInformation.every(
      //     (floor) =>
      //       floor.floor !== "" &&
      //       floor.area !== "" &&
      //       floor.usage !== "" &&
      //       floor.occupancy !== "" &&
      //       floor.flatNo !== "" &&
      //       floor.establishment !== "" &&
      //       floor.establishmentName !== ""
      //   );
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true; // No validation needed for Facility Details
      default:
        return false;
    }
  };

  //click submit

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when the form submission starts

    const formData = new FormData();
    let AssessmentNo = assmtNo;
    let oldAssessmentNo = OldassmtNo;

    let zone = selectedZone;
    // console.log(selectedBuildingUsedAs);
    // console.log(AssessmentNo);
    // console.log(oldAssessmentNo);
    let user_id = localStorage.getItem("user_id");
    const jsonData = {
      user_id,
      BuildingName,
      Gisid,
      AssessmentNo,
      oldAssessmentNo,
      TotalFloor,
      address1,
      address2,
      area,
      city,
      floorInformation,
      headRooms,
      liftRooms,
      location,
      oht,
      parking,
      pinCode,
      ramp,
      selectedAreaofplot,
      selectedBuildingUsedAs,
      selectedDoorNo,
      selectedHoarding,
      selectedMobile,
      selectedMobileTower,
      selectedOwner,
      selectedPROPERTY_OWNERSHIP,
      selectedStreet,
      selectedWard,
      selectedbuildingTypeOptions,
      state,
      zone,
    };

    formData.append("jsonData", JSON.stringify(jsonData));
    formData.append("selectedFile", selectedFile);

    // try {
    //   const response = await fetch(
    //     "https://luisnellai.xyz/siraj/postbuildingdata.php",
    //     {
    //       method: "POST",
    //       body: formData,
    //     }
    //   );

    //   const result = await response.json();
    //   console.log("Response:", result);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    try {
      const response = await fetch(
        "https://luisnellai.xyz/siraj/postbuildingdata.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        setSuccessMessage("Building data submitted successfully!");
        setErrorMessage(""); // Clear any previous error message
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      } else {
        setErrorMessage("Failed to submit building data. Please try again.");
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while submitting building data.");
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setLoading(false); // Set loading to false when the form submission ends
      setOpenSnackbar(true); // Open the snackbar to display message
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const onLogOut = async () => {
    localStorage.removeItem("user_token");

    window.location.href = "/";

    // window.href = "/user_login";
  };

  // Function to handle the open dialog action
  //  const handleOpenDialog = () => {
  //   setOpenDialog(true);
  // };

  // Function to handle the close dialog action
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleRadioChange = (event) => {
    if (event.target.value === "old") {
      setOpenDialog(true); // Open the dialog if "New" is selected
    }
  };
  const handleDialogClose = () => {
    setOpenDialog(false); // Close dialog without saving
  };
  const handleDialogSubmit = () => {
    if (billCount <= 0) {
      message.error("Please enter a valid number of bills.");
      return;
    }
    // Handle the submitted bill count here
    console.log("Number of bills: ", billCount);
    setOpenDialog(false); // Close dialog after submitting
  };
  const handleFieldChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  // Handle the change in Ward input
  const handleWardChange = (event) => {
    setEditedWard(event.target.value);
  };

  // Handle the change in Street input
  const handleStreetChange = (event) => {
    setEditedStreet(event.target.value);
  };

  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
  const [editedWard, setEditedWard] = useState(""); // State to capture the edited ward
  const [editedStreet, setEditedStreet] = useState(""); // State to capture the edited street

  // Submit the edited data to the API
  const handleSubmitEdit = async () => {
    if (!editedWard || !editedStreet) {
      message.error("Both Ward and Street must be filled in.");
      return;
    }

    try {
      const response = await fetch("https://luisnellai.xyz/siraj/editstreetdata.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AssessmentNo : selectedBillNo,
          EditedWard: editedWard, // The edited Ward
          EditedStreet: editedStreet, // The edited Street
        }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Street and Ward details updated successfully!");
      } else {
        message.error("Failed to update street and ward details.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while updating street and ward details.");
    } finally {
      handleCloseDialog(); // Close the dialog after submission
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">PROPERTY INFORMATION</Typography>
          <Button
            style={{ color: "white", marginLeft: "auto" }}
            onClick={onLogOut}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        {/* <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper> */}

        <Row>
          <Col style={{ marginTop: "4%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Col>
        </Row>
        {/* {activeStep === 0 && (
          <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
            <Typography variant="h5">Location Details</Typography>
            <Box mt={3}>
              <Row>
                <Col md={4} className="mt-3">
                  <FormControl fullWidth>
                    <TextField label="Zone" variant="outlined" />
                  </FormControl>
                </Col>
                <Col md={4} className="mt-3">
                  <FormControl fullWidth>
                    <InputLabel>Ward</InputLabel>
                    <Select
                      label="Ward"
                      variant="outlined"
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                    >
                      {wardOptions.map((ward) => (
                        <MenuItem key={ward} value={ward}>
                          {ward}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
                <Col md={4} className="mt-3">
                  <FormControl fullWidth>
                    <InputLabel>Street Name</InputLabel>
                    <Select
                      label="Street Name"
                      variant="outlined"
                      value={selectedStreet}
                      onChange={(e) => setSelectedStreet(e.target.value)}
                      disabled={!selectedWard}
                    >
                      {streetOptions.map((street) => (
                        <MenuItem key={street} value={street}>
                          {street}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
              </Row>
            </Box>
          </Paper>
        )} */}
        {activeStep === 0 && (
          <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
            <Typography variant="h5">Property Information</Typography>
            <Box mt={3}>
              <Row className="mt-3">
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="GIS ID"
                      onChange={(e) => setGisId(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    {/* <InputLabel>Ward</InputLabel>
                    <Select
                      label="Ward"
                      variant="outlined"
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                    >
                      {wardOptions.map((ward) => (
                        <MenuItem key={ward} value={ward}>
                          {ward}
                        </MenuItem>
                      ))}
                    </Select> */}
                    <Autocomplete
                        options={wardOptions}
                        value={selectedWard}
                        onChange={(e, newValue) => setSelectedWard(newValue)}
                        renderInput={(params) => <TextField {...params} label="Ward No" variant="outlined" />}
                      />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    {/* <InputLabel>Street Name</InputLabel>
                    <Select
                      label="Street Name"
                      variant="outlined"
                      value={selectedStreet}
                      onChange={(e) => setSelectedStreet(e.target.value)}
                      disabled={!selectedWard}
                    >
                      {streetOptions.map((street) => (
                        <MenuItem key={street} value={street}>
                          {street}
                        </MenuItem>
                      ))}
                    </Select> */}
                    <Autocomplete
                      options={streetOptions}
                      value={selectedStreet}
                      onChange={(e, newValue) => setSelectedStreet(newValue)}
                      renderInput={(params) => <TextField {...params} label="Road Name" variant="outlined" />}
                      disabled={!selectedWard}
                    />
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    {/* <InputLabel>Property Ownership</InputLabel>
                    <Select
                      label="Property Ownership"
                      value={selectedPROPERTY_OWNERSHIP}
                      onChange={(e) =>
                        setselectedPROPERTY_OWNERSHIP(e.target.value)
                      }
                    >
                      {PROPERTY_OWNERSHIP.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select> */}
                    <Autocomplete
                      options={PROPERTY_OWNERSHIP}
                      value={selectedPROPERTY_OWNERSHIP}
                      onChange={(e, newValue) => setselectedPROPERTY_OWNERSHIP(newValue)}
                      renderInput={(params) => <TextField {...params} label="Property Usage" variant="outlined" />}
                    />
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    {/* <InputLabel>Building Type</InputLabel> */}
                    {/* <Select
                      label="Building Type"
                      value={selectedbuildingTypeOptions}
                      onChange={(e) => setbuildingTypeOptions(e.target.value)}
                    >
                      {buildingTypeOptions.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select> */}
                    <Autocomplete
                      options={buildingTypeOptions}
                      value={selectedbuildingTypeOptions}
                      onChange={(e, newValue) => setbuildingTypeOptions(newValue)}
                      renderInput={(params) => <TextField {...params} label="Property Type" variant="outlined" />}
                    />

                  </FormControl>
                </Col>
              </Row>
              <Row className="mt-3">
                  <Col md={12}>
                    <FormControl component="fieldset">
                      <RadioGroup row aria-label="status" name="status" onChange={handleRadioChange} >
                        <FormControlLabel
                          value="old"
                          control={<Radio />}
                          label="Old"
                        />
                        <FormControlLabel
                          value="new"
                          control={<Radio />}
                          label="New"
                        />
                      
                      </RadioGroup>
                    
                    </FormControl>
                  </Col>
                </Row>
                {propdata.map((data, index) => (
                    <React.Fragment key={index}>
                      <Row className="mt-3">
                      <h5>Bill Data {index +1}</h5>
                        <Col md={6} className="mt-3">
                          <FormControl fullWidth>
                            <Autocomplete
                              options={wardOptions}
                              value={data.selectedWard}
                              onChange={(e, newValue) => handleFieldChange(index, 'selectedWard', newValue)}
                              renderInput={(params) => <TextField {...params} label="Ward No" variant="outlined" />}
                            />
                          </FormControl>
                        </Col>
                        <Col md={6} className="mt-3">
                          <FormControl fullWidth>
                            <Autocomplete
                              options={streetOptions}
                              value={data.selectedStreet}
                              onChange={(e, newValue) => handleFieldChange(index, 'selectedStreet', newValue)}
                              renderInput={(params) => <TextField {...params} label="Road Name" variant="outlined" />}
                              disabled={!data.selectedWard}
                            />
                          </FormControl>
                        </Col>
                        <Col md={6}>
                          <FormControl fullWidth className="mt-3">
                            <TextField
                              label="Door Number"
                              variant="outlined"
                              value={data.selectedDoorNo}
                              onChange={(e) => handleFieldChange(index, 'selectedDoorNo', e.target.value)}
                              disabled
                            />
                          </FormControl>
                        </Col>
            
      
                      </Row>
                    </React.Fragment>
                  ))}
            </Box>
          </Paper>
        )}

        {/* {activeStep === 1 && (
          <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
            <Typography variant="h5">Address Details</Typography>
            <Box mt={3}>
              <Row>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Address 1"
                      onChange={(e) => setAdress1(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Address 2"
                      onChange={(e) => setAdress2(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Area"
                      onChange={(e) => setArea(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Location"
                      onChange={(e) => setLocationn(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="City"
                      onChange={(e) => setCity(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="State"
                      onChange={(e) => setState(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Pincode"
                      onChange={(e) => setPinCode(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
              </Row>
            </Box>
          </Paper>
        )} */}

       c

        <Box mt={3}>
          <Row>
            <Col md={6}>
              {activeStep !== 0 && (
                <Button variant="contained" onClick={handleBack}>
                  Back
                </Button>
              )}
              <br></br>
            </Col>
            <br></br>
            <br></br>

            <Col md={6} className="text-right">
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              )}
            </Col>
          </Row>
        </Box>
      </Container>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Enter Number of Bills</DialogTitle>
        <DialogContent>
          <TextField
            label="Number of Bills"
            type="number"
            value={billCount}
            onChange={(e) => {
              const count = e.target.value; // Ensure minimum 1
              setBillCount(count);
              handleAddForms(count);
            }}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PropertyDetails;
    