import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const buildingTypeOptions = [
  "Super Structure",
  "Special Building",
  "Vacant Land",
  "Independent Building",
  "Flats in Multi Storied Building",
  "Central Government 33%",
  "Central Government 75%",
  "State Government",
  "Cell Phone Tower",
  "Cinema Theater",
  "Hospital",
  "Hotel / Lodging House",
  "Kalyana Mandapam",
  "Educational Institution",
  "Central Government 50%",
  "Flat",
  "Hostel",
];

const buildingUsedAsOptions = [
  "Mixed",
  "Residential",
  "Commercial",
  "Others",
  "Vacant Land",
];

const PROPERTY_OWNERSHIP = [
  "Mixed",
  "Residential",
  "Commercial",
  "Others",
  "Vacant Land",
];

const PROPERTY_TYPE = [
  "Mixed",
  "Residential",
  "Commercial",
  "Others",
  "Vacant Land",
];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState([]);

  const [wardOptions, setWardOptions] = useState([]);
  const [streetOptions, setStreetOptions] = useState([]);
  const [assessmentOptions, setAssessmentOptions] = useState([]);

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

  //Address Details
  const [address1, setAdress1] = useState("");
  const [address2, setAdress2] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocationn] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  //Floor Information
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

  const steps = [
    "Location Details",
    "Property Info",
    "Address Details",
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
          setSelectedDoorNo(data.NewDoorNo);
          setSelectedOwner(data.Owner_name);
          setselectedAreaofplot(data.PlotArea);
          setSelectedMobile(data.Mobileno);
        })
        .catch((error) => {
          console.error("Error sending POST request:", error);
        });
    }
  }, [selectedBillNo]);

  useEffect(() => {
    fetch("https://luisnellai.xyz/siraj/getproperty.php")
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
    }
  }, [selectedStreet, data]);

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return selectedStreet !== "" && selectedWard !== "";
      case 1:
        return (
          selectedBillNo !== "" &&
          selectedBuildingUsedAs !== "" &&
          selectedPROPERTY_OWNERSHIP !== "" &&
          Gisid !== "" &&
          selectedbuildingTypeOptions !== "" &&
          selectedDoorNo !== "" &&
          selectedOwner !== "" &&
          selectedAreaofplot !== "" &&
          selectedMobile !== "" &&
          BuildingName !== "" &&
          TotalFloor !== ""
        );
      case 2:
        return (
          address1 !== "" &&
          address2 !== "" &&
          area !== "" &&
          location !== "" &&
          city !== "" &&
          state !== "" &&
          pinCode !== ""
        );
      case 3:
        return floorInformation.every(
          (floor) =>
            floor.floor !== "" &&
            floor.area !== "" &&
            floor.usage !== "" &&
            floor.occupancy !== "" &&
            floor.flatNo !== "" &&
            floor.establishment !== "" &&
            floor.establishmentName !== ""
        );
      case 4:
        return true; // No validation needed for Facility Details
      default:
        return false;
    }
  };

  //click submit

  // const handleSubmit = () => {
  //   const formData = {
  //     selectedWard,
  //     selectedStreet,
  //     selectedBillNo,
  //     selectedDoorNo,
  //     Gisid,
  //     selectedOwner,
  //     BuildingName,
  //     TotalFloor,
  //     selectedAreaofplot,
  //     selectedMobile,
  //     selectedBuildingUsedAs,
  //     selectedPROPERTY_OWNERSHIP,
  //     selectedbuildingTypeOptions,
  //     address1,
  //     address2,
  //     area,
  //     location,
  //     city,
  //     state,
  //     pinCode,
  //     floorInformation,
  //     selectedHoarding,
  //     selectedMobileTower,
  //     headRooms,
  //     liftRooms,
  //     parking,
  //     ramp,
  //     oht,
  //     selectedFile,
  //   };

  //   console.log("Form Data:", formData);
  // };

  // const handleSubmit = async () => {
  //   // Create a FormData object to send mixed content (JSON + file)
  //   const formData = new FormData();

  //   // Append JSON data to FormData
  //   formData.append(
  //     "jsonData",
  //     JSON.stringify({
  //       BuildingName,
  //       Gisid,
  //       TotalFloor,
  //       address1,
  //       address2,
  //       area,
  //       city,
  //       floorInformation,
  //       headRooms,
  //       liftRooms,
  //       location,
  //       oht,
  //       parking,
  //       pinCode,
  //       ramp,
  //       selectedAreaofplot,
  //       selectedBillNo,
  //       selectedBuildingUsedAs,
  //       selectedDoorNo,
  //       selectedHoarding,
  //       selectedMobile,
  //       selectedMobileTower,
  //       selectedOwner,
  //       selectedPROPERTY_OWNERSHIP,
  //       selectedStreet,
  //       selectedWard,
  //       selectedbuildingTypeOptions,
  //       state,
  //     })
  //   );

  //   // Append selectedFile (if present) to FormData
  //   if (selectedFile) {
  //     formData.append("selectedFile", selectedFile);
  //   }

  //   console.log(formData);

  //   try {
  //     const response = await fetch(
  //       "https://luisnellai.xyz/siraj/postbuildingdata.php",
  //       {
  //         method: "POST",
  //         body: formData, // Pass FormData object as body
  //       }
  //     );

  //     const result = await response.json();
  //     console.log("Response:", result);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  const handleSubmit = async () => {
    const formData = new FormData();

    const jsonData = {
      BuildingName,
      Gisid,
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
      selectedBillNo,
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
    };

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">GIS</Typography>
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
          <Col style={{ marginTop: "2%" }}>
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
        )}
        {activeStep === 1 && (
          <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
            <Typography variant="h5">Property Information</Typography>
            <Box mt={3}>
              <Row className="mt-3">
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Property Ownership</InputLabel>
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
                    </Select>
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Building Type</InputLabel>
                    <Select
                      label="Building Type"
                      value={selectedbuildingTypeOptions}
                      onChange={(e) => setbuildingTypeOptions(e.target.value)}
                    >
                      {buildingTypeOptions.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={12}>
                  <FormControl component="fieldset">
                    <RadioGroup row aria-label="status" name="status">
                      <FormControlLabel
                        value="active"
                        control={<Radio />}
                        label="Active"
                      />
                      <FormControlLabel
                        value="new"
                        control={<Radio />}
                        label="New"
                      />
                      <FormControlLabel
                        value="inactive"
                        control={<Radio />}
                        label="Inactive"
                      />
                      <FormControlLabel
                        value="completed"
                        control={<Radio />}
                        label="Completed"
                      />
                    </RadioGroup>
                  </FormControl>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Bill Number</InputLabel>
                    <Select
                      label="Bill Number"
                      value={selectedBillNo}
                      onChange={(e) => setSelectedBillNo(e.target.value)}
                    >
                      {assessmentOptions.map((bill) => (
                        <MenuItem key={bill} value={bill}>
                          {bill}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Door Number"
                      variant="outlined"
                      value={selectedDoorNo}
                      onChange={(e) => setSelectedDoorNo(e.target.value)}
                      disabled
                    />
                  </FormControl>
                </Col>
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
                    <InputLabel>Building Used As</InputLabel>
                    <Select
                      label="Building Used As"
                      variant="outlined"
                      value={selectedBuildingUsedAs}
                      onChange={(e) =>
                        setSelectedBuildingUsedAs(e.target.value)
                      }
                    >
                      {buildingUsedAsOptions.map((option) => (
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
                      label="Name of Assessee"
                      variant="outlined"
                      value={selectedOwner}
                      onChange={(e) => setSelectedOwner(e.target.value)}
                      disabled
                    />
                  </FormControl>
                </Col>

                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Building Name"
                      onChange={(e) => setBuildingName(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Total Floor"
                      onChange={(e) => setTotalFloor(e.target.value)}
                      variant="outlined"
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Area of Plot"
                      variant="outlined"
                      value={selectedAreaofplot}
                      onChange={(e) => setselectedAreaofplot(e.target.value)}
                      disabled
                    />
                  </FormControl>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Mobile"
                      variant="outlined"
                      value={selectedMobile}
                      onChange={(e) => setSelectedMobile(e.target.value)}
                      disabled
                    />
                  </FormControl>
                </Col>
              </Row>
            </Box>
          </Paper>
        )}

        {activeStep === 2 && (
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
        )}

        {activeStep === 3 && (
          <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
            <Typography variant="h5">Floor Information</Typography>
            <Box mt={3}>
              {floorInformation.map((floor) => (
                <Paper
                  key={floor.id}
                  elevation={3}
                  style={{ padding: "20px", margin: "20px 0" }}
                >
                  <Row>
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Floor"
                          name="floor"
                          variant="outlined"
                          value={floor.floor}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Area"
                          name="area"
                          variant="outlined"
                          value={floor.area}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Usage"
                          name="usage"
                          variant="outlined"
                          value={floor.usage}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Occupancy"
                          name="occupancy"
                          variant="outlined"
                          value={floor.occupancy}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Flat No"
                          name="flatNo"
                          variant="outlined"
                          value={floor.flatNo}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Establishment"
                          name="establishment"
                          variant="outlined"
                          value={floor.establishment}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <TextField
                          label="Establishment Name"
                          name="establishmentName"
                          variant="outlined"
                          value={floor.establishmentName}
                          onChange={(e) => handleFloorChange(floor.id, e)}
                        />
                      </FormControl>
                    </Col>
                    <Col md={6}>
                      <IconButton
                        color="secondary"
                        className="mt-3"
                        onClick={() => deleteFloorInformation(floor.id)}
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
        {activeStep === 4 && (
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
                      label="No. of Head Rooms"
                      variant="outlined"
                      value={headRooms}
                      onChange={(e) => setHeadRooms(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="No. of Lift Rooms"
                      variant="outlined"
                      value={liftRooms}
                      onChange={(e) => setLiftRooms(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Parking"
                      variant="outlined"
                      value={parking}
                      onChange={(e) => setParking(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="Ramp"
                      variant="outlined"
                      value={ramp}
                      onChange={(e) => setRamp(e.target.value)}
                    />
                  </FormControl>
                </Col>
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <TextField
                      label="OHT"
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
            <Box mt={4} textAlign="center">
              <MuiButton
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Final Submit
              </MuiButton>
            </Box>
          </Paper>
        )}

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
    </div>
  );
}

export default App;
