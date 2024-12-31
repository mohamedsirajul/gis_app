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

const buildingTypeOptions = [
  "Independent Building",
  "Government Property",
  "Cinema Theatre",
  "Education Institution",
  "Hospital",
  "Restaurant / Hotel",
  "Lodges / Residency / PG Hotel",
  "Shopping Mall",
  "Religious Structure",
  "God own / Warehouse",
  "Vacant land",
];

const PROPERTY_OWNERSHIP = [
  "Residence",
  "Commercial",
  "Mixed",
  "Vacant Land",
  "Industrials",
  "Education Institutions",
  "Special Type",
  "Government Building",
  "Others",
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
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [proptype, setpropType] = useState(false);
  const [billCount, setBillCount] = useState(1);
  const [billData, setBillData] = useState([
    { selectedWard: "", selectedStreet: "", streetOptions: [], billOptions: [], selectedBillNo: "", selectedDoorNo: "", selectedOwner: "", selectedMobile: "", usagename: "", selectedAreaofplot: "" },
  ]);

  console.log(billData);
  
  const [wardOptions, setWardOptions] = useState([]);
  const [buildingType, setBuildingType] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [Gisid, setGisId] = useState("");
  const [billDataOptions, setBillDataOptions] = useState([]);

  
  //location details
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");

  //Property Information
  const [selectedPROPERTY_OWNERSHIP, setselectedPROPERTY_OWNERSHIP] =
    useState("");
  const [selectedbuildingTypeOptions, setbuildingTypeOptions] = useState("");
  const [selectedBillNo, setSelectedBillNo] = useState("");
  const [selectedDoorNo, setSelectedDoorNo] = useState("");
  const [selectedBuildingUsedAs, setSelectedBuildingUsedAs] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [BuildingName, setBuildingName] = useState("");
  const [TotalFloor, setTotalFloor] = useState("");
  const [selectedAreaofplot, setselectedAreaofplot] = useState("");
  const [selectedMobile, setSelectedMobile] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  //loadiing
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [assmtNo, setassmtNo] = useState("");
  const [OldassmtNo, setOldassmtNo] = useState("");
  const [usagename, setusagename] = useState("");
  const [OwnerOptions, setOwnerOptions] = useState([]);

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


  const steps = ["Property Info", "Floor Info", "Facility Details"];

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    fetch(`https://luisnellai.xyz/siraj/admin/get_assigned_task.php/${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        const uniqueWards = [...new Set(data.map((item) => item.WardName))];
        setWardOptions(uniqueWards);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

 const handleAddBillData = (count) => {
    const newBillData = Array.from({ length: count }, () => ({
      selectedWard: "",
      selectedStreet: "",
      streetOptions: [],
      billOptions: [],
      selectedBillNo: "",
      selectedDoorNo: "",
      selectedOwner: "",
      selectedMobile: "",
      usagename: "",
      selectedAreaofplot: ""
    }));
    setBillData(newBillData);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedBillData = [...billData];
    updatedBillData[index][field] = value;
    setBillData(updatedBillData); // Immediately trigger re-render

    if (field === "selectedWard") {
      const streets = data
        .filter((item) => item.WardName === value)
        .map((item) => item.StreetName);
      const uniqueStreets = [...new Set(streets)];
      updatedBillData[index].streetOptions = uniqueStreets;
      updatedBillData[index].selectedStreet = ""; // Reset street when ward changes
      updatedBillData[index].billOptions = [];
      updatedBillData[index].selectedBillNo = ""; // Reset bill number
      setBillData(updatedBillData);
    }

    if (field === "selectedStreet") {
      const bills = data
        .filter((item) => item.StreetName === value)
        .map((item) => item.AssesmentNo);
      const uniqueBills = [...new Set(bills)];
      updatedBillData[index].billOptions = uniqueBills;
      updatedBillData[index].selectedBillNo = ""; // Reset bill number
      setBillData(updatedBillData);
    }

    if (field === "selectedBillNo") {
      const selectedBillNo = value;
      if (selectedBillNo) {
        // Fetch and update data when Bill Number is selected
        fetch("https://luisnellai.xyz/siraj/getbybillno.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ billnum: selectedBillNo }),
        })
          .then((response) => response.json())
          .then((responseData) => {
            const updatedData = [...billData];
            updatedData[index].selectedDoorNo = responseData.NewDoorNo || '';
            updatedData[index].selectedOwner = responseData.Owner_name || '';
            updatedData[index].selectedMobile = responseData.Mobileno || '';
            updatedData[index].selectedAreaofplot = responseData.PlotArea || '';
            updatedData[index].selectedZone = responseData.zone || '';
            updatedData[index].assmtNo = responseData.AssesmentNo || '';
            updatedData[index].oldAssmtNo = responseData.OldAssesmentNo || '';
            updatedData[index].usagename = responseData.usagename || '';

            setBillData(updatedData); // Trigger re-render after updating data
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  };

  
  
  
  
  
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  const handleRadioChange = (event) => {
    if (event.target.value === "old") {
      setpropType(false)
      setOpenDialog(true);
    }
    if (event.target.value === "new") {
      setpropType(true)
      setOpenDialog(true);    }
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleDialogSubmit = () => {
    if (billCount <= 0) {
      message.error("Please enter a valid number of bills.");
      return;
    }
    handleAddBillData(billCount);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


   //click submit

   const handleSubmit = async () => {
    setLoading(true); // Set loading to true when the form submission starts
  
    const formData = new FormData();
    const AssessmentNo = assmtNo;
    const oldAssessmentNo = OldassmtNo;
    const zone = selectedZone;
    let user_id = localStorage.getItem("user_id");
  
    // Creating the jsonData object that will be sent in the POST request
    const jsonData = {
      billData, // Bill Data array
      floorInformation, // Floor Information array
      user_id, // User ID from localStorage
      BuildingName,
      Gisid,
      AssessmentNo,
      oldAssessmentNo,
      TotalFloor,
      address1,
      address2,
      area,
      city,
      location,
      headRooms,
      liftRooms,
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
      zone, // Zone
    };
  
    // Append the JSON data and selected file to the formData
    formData.append("jsonData", JSON.stringify(jsonData));
    formData.append("selectedFile", selectedFile);
  
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
        // Optionally, navigate or perform any actions after successful submission
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

  const onLogOut = () => {
    localStorage.removeItem("user_token");
    window.location.href = "/";
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return billData.every(
          (entry) => entry.selectedWard && entry.selectedStreet
        );
      case 1:
      case 2:
        return true;
      default:
        return false;
    }
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

  const deleteFloorInformation = (id) => {
    const updatedFloorInfo = floorInformation.filter((item) => item.id !== id);
    setFloorInformation(updatedFloorInfo);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


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


  const [editopenDialog, setEditOpenDialog] = useState(false); // State to control the dialog
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
                    <Autocomplete
                      options={PROPERTY_OWNERSHIP}
                      value={ownershipType}
                      onChange={(e, newValue) => setOwnershipType(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Property Usage"
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <Autocomplete
                      options={buildingTypeOptions}
                      value={buildingType}
                      onChange={(e, newValue) => setBuildingType(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Property Type"
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="status"
                      name="status"
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel value="old" control={<Radio />} label="Old" />
                      <FormControlLabel value="new" control={<Radio />} label="New" />
                    </RadioGroup>
                  </FormControl>
                </Col>
              </Row>
              {billData.map((entry, index) => (
                <Paper key={index} elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
                  <Typography variant="h5">Property Information for Entry {index + 1}</Typography>
                  <Box mt={3}>
                    {/* Ward and Street selection */}
                    <Row className="mt-3">
                      <Col md={6}>
                        {/* <FormControl fullWidth className="mt-3">
                          <InputLabel>Ward Number</InputLabel>
                          <Select
                            value={entry.selectedWard}
                            onChange={(e) => handleFieldChange(index, "selectedWard", e.target.value)}
                          >
                            {wardOptions.map((ward) => (
                              <MenuItem key={ward} value={ward}>
                                {ward}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                        {proptype ? (
  <FormControl fullWidth className="mt-3">
   
    <TextField
                            label="Ward Number"
                            variant="outlined"
                            value={entry.selectedWard}
      onChange={(e) => handleFieldChange(index, "selectedWard", e.target.value)}
                          />
  </FormControl>
) : (
  <FormControl fullWidth className="mt-3">
    <InputLabel>Ward Number</InputLabel>
    <Select
      value={entry.selectedWard}
      onChange={(e) => handleFieldChange(index, "selectedWard", e.target.value)}
    >
      {wardOptions.map((ward) => (
        <MenuItem key={ward} value={ward}>
          {ward}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}
                      </Col>
                      <Col md={6}>
                  
                        {proptype ? (
  <FormControl fullWidth className="mt-3">
   
    <TextField
                            label="Street"
                            variant="outlined"
                            value={entry.selectedStreet}
                            onChange={(e) => handleFieldChange(index, "selectedStreet", e.target.value)}
                          />
  </FormControl>
) : (
  <FormControl fullWidth className="mt-3">
  <InputLabel>Street</InputLabel>
  <Select
    value={entry.selectedStreet}
    onChange={(e) => handleFieldChange(index, "selectedStreet", e.target.value)}
    disabled={!entry.selectedWard}
  >
    {entry.streetOptions.map((street) => (
      <MenuItem key={street} value={street}>
        {street}
      </MenuItem>
    ))}
  </Select>
</FormControl>
)}
                      </Col>
                    </Row>

                    {/* Bill Number and Data */}
                    <Row className="mt-3">
                      <Col md={6}>
                       
                        {proptype ? (
  <FormControl fullWidth className="mt-3">
   
    <TextField
                            label="Street"
                            variant="outlined"
                            value={entry.selectedBillNo}
          onChange={(e) => handleFieldChange(index, "selectedBillNo", e.target.value)}
                          />
  </FormControl>
) : (
  <FormControl fullWidth className="mt-3">
  <InputLabel>Bill Number</InputLabel>
  <Select
    value={entry.selectedBillNo}
    onChange={(e) => handleFieldChange(index, "selectedBillNo", e.target.value)}
    disabled={!entry.selectedStreet}
  >
    {entry.billOptions.map((bill) => (
      <MenuItem key={bill} value={bill}>
        {bill}
      </MenuItem>
    ))}
  </Select>
</FormControl>
)}
                      </Col>
                      <Col md={6}>
                        <FormControl fullWidth className="mt-3">
                          <TextField
                            label="Door Number"
                            variant="outlined"
                            value={entry.selectedDoorNo} // Updated door number after API fetch
                            // disabled
                          />
                        </FormControl>
                      </Col>
                    </Row>

                    {/* Assessee Name, Mobile, Usage, and Area */}
                    <Row className="mt-3">
                      <Col md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Name of Assessee"
                            variant="outlined"
                            value={entry.selectedOwner} // Updated owner name after API fetch
                            // disabled
                          />
                        </FormControl>
                      </Col>
                      <Col md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Mobile"
                            variant="outlined"
                            value={entry.selectedMobile} // Updated mobile number after API fetch
                            // disabled
                          />
                        </FormControl>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Building Used As"
                            variant="outlined"
                            value={entry.usagename} // Updated building usage after API fetch
                            // disabled
                          />
                        </FormControl>
                      </Col>
                      <Col md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Area of Plot"
                            variant="outlined"
                            value={entry.selectedAreaofplot} // Updated plot area after API fetch
                            // disabled
                          />
                        </FormControl>
                      </Col>
                    </Row>
                  </Box>
                </Paper>
              ))}


            </Box>
          </Paper>
        )}


 {activeStep === 1 && (
          <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
            <Typography variant="h5">Floor Information</Typography>
            <Box mt={3}>
              {floorInformation.map((floor, index) => (
                <Paper
                  key={floor.id}
                  elevation={3}
                  style={{ padding: "20px", margin: "20px 0" }}
                >
                  <Row>
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        {/* <TextField
                          label="Floor"
                          name="floor"
                          variant="outlined"
                          value={floor.floor}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        /> */}
                        <InputLabel>Floor</InputLabel>
                        <Select
                          label="Floor"
                          name="floor"
                          variant="outlined"
                          value={floor.floor}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        >
                          {NoOfFloor.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Col>
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Area Calculation"
                          name="area"
                          variant="outlined"
                          // value={floor.area}
                          value={selectedAreaofplot}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        {/* <TextField
                          label="Usage"
                          name="usage"
                          variant="outlined"
                          value={floor.usage}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        /> */}
                        <InputLabel>Usage</InputLabel>
                        <Select
                          label="Usage"
                          name="usage"
                          variant="outlined"
                          value={floor.usage}
                          onChange={(e) => handleUsageChange(floor.id, e)}
                        >
                          {FloorusageOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {/* <TextField
                          label="Usage"
                          name="usage"
                          variant="outlined"
                          value={usagename}
                          onChange={(e) => handleUsageChange(floor.id, e)}
                          
                        /> */}
                      </FormControl>
                    </Col>
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        {/* <TextField
                          label="Occupancy"
                          name="occupancy"
                          variant="outlined"
                          value={floor.occupancy}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        /> */}
                        <InputLabel>Construction Type </InputLabel>
                        <Select
                          label="Occupancy"
                          name="occupancy"
                          variant="outlined"
                          value={floor.occupancy}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        >
                          {FloorOccupancy.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Percentage Used"
                          name="flatNo"
                          variant="outlined"
                          value={floor.flatNo}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                    {/* <Col md={6}>
                      {floor.usage === "Residential" ? null : (
                        <FormControl fullWidth className="mt-3">
                          <TextField
                            label="Establishment"
                            name="establishment"
                            variant="outlined"
                            value={floor.establishment}
                            onChange={(e) => handleFloorChange(floor.id, e)}
                          />
                          <InputLabel>Establishment</InputLabel>
                          <Select
                            label="Establishment"
                            name="establishment"
                            variant="outlined"
                            value={floor.establishment}
                            onChange={(e) => handleFloorChange(floor.id, e)}
                            onOpen={() => filterOptions(searchInput)}
                          >
                            {filteredOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Col> */}
                  </Row>
                  <Row className="mt-3">
                    {/* <Col md={6}>
                      {floor.usage === "Residential" ? null : (
                        <FormControl fullWidth className="mt-3">
                          <TextField
                            label="Establishment Name"
                            name="establishmentName"
                            variant="outlined"
                            value={floor.establishmentName}
                            onChange={(e) => handleFloorChange(floor.id, e)}
                          />
                        </FormControl>
                      )}
                    </Col> */}
                    <Col md={6}>
                      <IconButton
                        color="secondary"
                        className="mt-3"
                        onClick={() => deleteFloorInformation(floor.id)}
                        disabled={index === 0} // Disable delete for the first floor
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Col>
                  </Row>
                </Paper>
              ))}
              <MuiButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addFloorInformation}
              >
                Add Floor
              </MuiButton>
            </Box>
          </Paper>
        )}
        {activeStep === 2 && (
          <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
            <Typography variant="h5">Facility Details</Typography>
            <Box mt={3}>
              <Row>
                <Col md={6}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="hoarding"
                      name="hoarding"
                      value={selectedHoarding}
                      onChange={(e) => setSelectedHoarding(e.target.value)}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Hoarding Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="Hoarding No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="mobile_phone_tower"
                      name="mobile_phone_tower"
                      value={selectedMobileTower}
                      onChange={(e) => setSelectedMobileTower(e.target.value)}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Mobile Phone Tower Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="Mobile Phone Tower No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Head Rooms (no of Head Rooms / area of Head Rooms)"
                      variant="outlined"
                      value={headRooms}
                      onChange={(e) => setHeadRooms(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Lift Rooms (no of Lift Rooms / area of Lift Rooms)"
                      variant="outlined"
                      value={liftRooms}
                      onChange={(e) => setLiftRooms(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Parking (no of Parking / area of Parking)"
                      variant="outlined"
                      value={parking}
                      onChange={(e) => setParking(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Ramp (no of Ramp / area of Ramp)"
                      variant="outlined"
                      value={ramp}
                      onChange={(e) => setRamp(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="OHT (no of OHT / area of OHT)"
                      variant="outlined"
                      value={oht}
                      onChange={(e) => setOht(e.target.value)}
                    />
                  </FormControl>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={12}>
                  <FormControl fullWidth>
                    <input type="file" onChange={handleFileChange} />
                  </FormControl>
                </Col>
              </Row>
            </Box>
            {/* <Box mt={4} textAlign="center">
              <MuiButton
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Final Submit
              </MuiButton>
            </Box> */}
            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={
                  loading && <CircularProgress size={20} color="inherit" />
                }
              >
                Final Submit
              </Button>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000} // Adjust as needed
                onClose={handleCloseSnackbar}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={handleCloseSnackbar}
                  severity={successMessage ? "success" : "error"}
                >
                  {successMessage || errorMessage}
                </MuiAlert>
              </Snackbar>
            </Box>
          </Paper>
        )}
        <Box display="flex" justifyContent="space-between" mt={3}>
          {activeStep > 0 && (
            <Button onClick={handleBack} variant="contained" color="secondary">
              Back
            </Button>
          )}
          <Button
            onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
            variant="contained"
            color="primary"
            disabled={!isStepValid()}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Container>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Bill Count</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Number of Bills"
            type="number"
            fullWidth
            value={billCount}
            onChange={(e) => setBillCount(parseInt(e.target.value, 10))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PropertyDetails;
