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
  Chip,
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
    "Flat / Apartment",
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
  const [proptype, setpropType] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({});

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
      profTaxNo: "",
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

  // Add a new state for next button loading
  const [nextLoading, setNextLoading] = useState(false);

  const [gisIdSource, setGisIdSource] = useState('manual'); // 'manual' or 'map'

  // Update the handleNext function
  const handleNext = async () => {
    setNextLoading(true);
    try {
      if (isStepValid()) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSuccessMessage("");
        setErrorMessage("");
        setOpenSnackbar(false);
      }
    } finally {
      setNextLoading(false);
    }
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
        profTaxNo: "",
        establishment: "",
        establishmentName: "",
      },
    ]);
  };

  const handleFloorChange = (id, event) => {
    const { name, value } = event.target;
    const updatedFloorInfo = floorInformation.map((item) => {
      if (item.id === id) {
        // Get base area based on floor number
        const baseArea = item.floor === 0 ? selectedAreaofplot : item.area;
        
        console.log(baseArea);
        // Calculate area if percentage is being changed
        let updates = { [name]: value };
        if (name === 'flatNo') { // percentage field
          const percentage = parseFloat(value) || 0;
          const calculatedArea = (baseArea * percentage) / 100;
          updates.calculatedArea = calculatedArea.toFixed(2);
        }
        
        // Clear prof tax numbers if usage is changed from Commercial
        if (name === 'usage' && value !== 'Commercial') {
          updates.profTaxNo = "";
        }
        
        return { ...item, ...updates };
      }
      return item;
    });
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
    const fetchData = async () => {
      try {
        const response = await fetch(`https://luisnellai.xyz/siraj/admin/get_assigned_task.php/${user_id}`);
        const result = await response.json();
        
        // Check if result has the expected structure
        if (result.status === "success" && Array.isArray(result.tasks)) {
          setData(result.tasks);
          
          // Get unique ward names
          const uniqueWards = [...new Set(result.tasks.map((item) => item.WardName))];
          setWardOptions(uniqueWards);

          // Get owner names
          const ownerNames = [...new Set(result.tasks.map((item) => item.Owner_name))];
          setOwnerOptions(ownerNames);
        } else {
          console.error('API response not in expected format:', result);
          setData([]);
          setWardOptions([]);
          setOwnerOptions([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setWardOptions([]);
        setOwnerOptions([]);
      }
    };

    if (user_id) {
      fetchData();
    }
  }, [user_id]);

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
    // if (selectedStreet) {
    //   const assessments = data
    //     .filter((item) => item.StreetName === selectedStreet)
    //     .map((item) => item.AssesmentNo);
    //   setAssessmentOptions(assessments);
    // } else {


      // Show all AssesmentNo if no street is selected
      const allAssessments = data.map((item) => item.AssesmentNo);

      console.log(allAssessments);
      
      setAssessmentOptions(allAssessments);
    // }
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
      case 0: // Property Info
        // Basic validation
        if (!Gisid.trim()) {
          message.error("GIS ID is required");
          return false;
        }
        if (!selectedbuildingTypeOptions) {
          message.error("Property Type is required");
          return false;
        }
        if (!selectedPROPERTY_OWNERSHIP) {
          message.error("Property Usage is required");
          return false;
        }
        if (!selectedBuildingUsedAs) {
          message.error("Construction Type is required");
          return false;
        }
        if (!selectedWard) {
          message.error("Ward Number is required");
          return false;
        }
        if (!selectedStreet) {
          message.error("Road Name is required");
          return false;
        }
        if (!selectedBillNo) {
          message.error("Bill Number is required");
          return false;
        }
        if (!selectedDoorNo) {
          message.error("Door Number is required");
          return false;
        }
        if (!selectedOwner) {
          message.error("Name of Assessee is required");
          return false;
        }
        // if (!BuildingName.trim()) {
        //   message.error("Building Name is required");
        //   return false;
        // }
        // if (!TotalFloor) {
        //   message.error("Total Floor is required");
        //   return false;
        // }
        if (!selectedAreaofplot) {
          message.error("Area of Plot is required");
          return false;
        }
        // if (!selectedMobile || !/^\d{10}$/.test(selectedMobile)) {
        //   message.error("Please enter a valid 10-digit mobile number");
        //   return false;
        // }
        return true;

      case 1: // Floor Info
        // Validate each floor's information
        for (let i = 0; i < floorInformation.length; i++) {
          const floor = floorInformation[i];
          
          if (!floor.floor && floor.floor !== 0) {
            message.error(`Floor number is required for Floor ${i + 1}`);
            return false;
          }
          
          if (!floor.area && i !== 0) { // Skip area validation for ground floor
            message.error(`Area is required for Floor ${i + 1}`);
            return false;
          }
          
          if (!floor.usage) {
            message.error(`Usage is required for Floor ${i + 1}`);
            return false;
          }
          
          if (!floor.occupancy) {
            message.error(`Construction Type is required for Floor ${i + 1}`);
            return false;
          }
          
          if (!floor.flatNo || isNaN(floor.flatNo) || floor.flatNo < 0 || floor.flatNo > 100) {
            message.error(`Please enter a valid percentage (0-100) for Floor ${i + 1}`);
            return false;
          }
        }
        return true;

      case 2: // Facility Details (Upload Image)
        if (!selectedFile) {
          message.error("Please upload an image");
          return false;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(selectedFile.type)) {
          message.error("Please upload a valid image file (JPEG, PNG, or JPG)");
          return false;
        }
        
        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (selectedFile.size > maxSize) {
          message.error("File size should be less than 5MB");
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  //click submit

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Determine which assessment number to use
      const finalAssessmentNo = proptype ? generatedAssessmentNo : assmtNo;
      
      // Format floor information
      const formattedFloorInfo = floorInformation.map((floor, index) => {
        const baseArea = index === 0 ? selectedAreaofplot : floor.area;
        const percentage = parseFloat(floor.flatNo) || 0;
        const calculatedArea = ((baseArea * percentage) / 100).toFixed(2);

        return {
          floor_no: floor.floor.toString() || "",
          floor_area: baseArea.toString() || "0",
          floor_usage: floor.usage || "",
          construction_type: floor.occupancy || "",
          percentage_used: floor.flatNo || "0",
          calculated_area: calculatedArea.toString(),
          prof_tax_no: floor.profTaxNo || ""
        };
      });

      const payload = {
        user_id: localStorage.getItem("user_id"),
        property_details: {
          gis_id: Gisid || "",
          assessment_no: finalAssessmentNo || "",
          old_assessment_no: OldassmtNo || "",
          ward_no: selectedWard || "",
          road_name: selectedStreet || "",
          door_no: selectedDoorNo || "",
          building_name: BuildingName || "",
          zone: selectedZone || "",
          property_type: selectedbuildingTypeOptions || "",
          property_usage: selectedPROPERTY_OWNERSHIP || "",
          construction_type: selectedBuildingUsedAs || "",
          total_floors: TotalFloor || "0",
          plot_area: selectedAreaofplot || "0",
          mobile_no: selectedMobile || "",
          owner_name: selectedOwner || "",
          split_status: selectedHoarding || "No Correction",
          is_new_property: proptype
        },
        floor_details: formattedFloorInfo,
        address_details: {
          address1: address1 || "",
          address2: address2 || "",
          area: area || "",
          location: location || "",
          city: city || "",
          state: state || "",
          pincode: pinCode || ""
        },
        facility_details: {
          head_rooms: headRooms || "",
          lift_rooms: liftRooms || "",
          parking: parking || "",
          ramp: ramp || "",
          oht: oht || "",
          mobile_tower: selectedMobileTower || "no"
        }
      };

      console.log('Final payload:', payload);

      // Create FormData and append the payload
      const formData = new FormData();
      formData.append("jsonData", JSON.stringify(payload));
      
      // Append file if selected
      if (selectedFile) {
        formData.append("selectedFile", selectedFile);
      }

      // Log the payload for debugging
      console.log("Sending payload:", payload);

      // Make the API call
      const response = await fetch(
        "https://luisnellai.xyz/siraj/postbuildingdata.php",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        // Refresh GIS IDs
        await fetchGisIds();
        
        setSuccessMessage("Building data submitted successfully!");
        setErrorMessage("");
        setOpenSnackbar(true);
        
        // Reset form after short delay
        setTimeout(() => {
          resetForm();
          setActiveStep(0);
        }, 2000);
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage("Failed to submit building data: " + error.message);
      setSuccessMessage("");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Update the resetForm function
  const resetForm = () => {
    // Do not reset these fields
    // const gisIdValue = Gisid;
    // const selectedHoardingValue = selectedHoarding;
    // const buildingTypeValue = selectedbuildingTypeOptions;
    // const propertyUsageValue = selectedPROPERTY_OWNERSHIP;
    // const constructionTypeValue = selectedBuildingUsedAs;

    // Reset all other fields
    // setGisId(""); // Remove this line to keep GIS ID
    // setSelectedHoarding(""); // Remove this line to keep Split/Merge/No Correction
    // setbuildingTypeOptions(""); // Remove this line to keep Property Type
    // setselectedPROPERTY_OWNERSHIP(""); // Remove this line to keep Property Usage
    // setSelectedBuildingUsedAs(""); // Remove this line to keep Construction Type
    
    // Reset remaining fields
    setSelectedBillNo("");
    setSelectedDoorNo("");
    setSelectedOwner("");
    setselectedAreaofplot("");
    setSelectedMobile("");
    setBuildingName("");
    setTotalFloor("");
    setSelectedMobileTower("");
    setSelectedWard("");
    setSelectedStreet("");
    setSelectedZone("");
    setassmtNo("");
    setOldassmtNo("");
    setusagename("");
    setAdress1("");
    setAdress2("");
    setArea("");
    setLocationn("");
    setCity("");
    setState("");
    setPinCode("");
    setHeadRooms("");
    setLiftRooms("");
    setParking("");
    setRamp("");
    setOht("");
    setFloorInformation([
      {
        id: 1,
        floor: "",
        area: "",
        usage: "",
        occupancy: "",
        flatNo: "",
        profTaxNo: "",
        establishment: "",
        establishmentName: "",
      },
    ]);
    setCalculatedValues({});
    setSelectedFile(null);
    setpropType(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const onLogOut = async () => {
    localStorage.removeItem("user_token");

    window.location.href = "/";

    // window.href = "/user_login";
  };

  const gotomap = () => {
    setOpenMapDialog(true);
  };

  const handleCloseMapDialog = () => {
    setOpenMapDialog(false);
    setSelectedMapWard('');
  };

  const handleWardSelect = () => {
    if (selectedMapWard) {
      const selectedWardOption = wardMapOptions.find(w => w.value === selectedMapWard);
      const wardPath = `/Gis_finder_ward_${selectedWardOption.displayValue}/index.html`;
      const mapWindow = window.open(wardPath, '_blank', 'width=1000,height=800,left=200,top=100');
      
      // Add event listener for messages from the map window
      window.addEventListener('message', function(event) {
        if (event.data.type === 'GISID_SELECTED') {
          const selectedGISID = event.data.gisId;
          setGisId(selectedGISID); // Set the formatted GIS ID
          setGisIdSource('map');
          setSelectedGisInfo(`Ward ${selectedGISID}`);
          message.success(`Selected GIS ID: ${selectedGISID}`);
        }
      }, false);
      
      handleCloseMapDialog();
    }
  };

  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [selectedMapWard, setSelectedMapWard] = useState('');

  const wardMapOptions = [
    { value: '001', label: 'Ward 01', displayValue: '001' },
    { value: '014', label: 'Ward 14', displayValue: '014' }, 
    { value: '016', label: 'Ward 16', displayValue: '016' }, 
    { value: '035', label: 'Ward 35', displayValue: '035' },
    { value: '036', label: 'Ward 36', displayValue: '036' },
    { value: '041', label: 'Ward 41', displayValue: '041' }
  ];

  // Function to handle the open dialog action
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle the close dialog action
  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  useEffect(() => {
    if (selectedOwner) {
      const relatedData = data.filter((item) => item.Owner_name === selectedOwner);
      // const streets = [...new Set(relatedData.map((item) => item))];
      const streets = [...new Set(relatedData.map((item) => item.StreetName))];
      const assessments = [...new Set(relatedData.map((item) => item.AssesmentNo))];

      setStreetOptions(streets);
      setAssessmentOptions(assessments);

      // If only one bill and street for the owner, auto-select
      if (streets.length === 1) setSelectedStreet(streets[0]);
      if (assessments.length === 1) setSelectedBillNo(assessments[0]);
    }
  }, [selectedOwner, data]);

  // const handleRadioChange = (event) => {
  //   if (event.target.value === "old") {
  //     setpropType(false)
  //   }
  //   if (event.target.value === "new") {
  //     setpropType(true)
  // }
  // };

  // To retrieve the GISID
  const storedGISID = localStorage.getItem('selectedGISID');

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'GISID_SELECTED') {
        const selectedGISID = event.data.gisId;
        console.log('Selected GISID:', selectedGISID);
        setGisId(selectedGISID);
        setGisIdSource('map');
        message.success('GIS ID selected from map!');
      }
    };

    const storedGISID = localStorage.getItem('selectedGISID');
    if (storedGISID) {
      setGisId(storedGISID);
      setGisIdSource('map');
      localStorage.removeItem('selectedGISID');
      message.success('GIS ID loaded from previous selection!');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Function to handle manual GIS ID changes
  const handleGisIdChange = (e) => {
    setGisId(e.target.value);
    setGisIdSource('manual');
  };

  // Update the generateBillNumber function to maintain consistent formatting
  const generateBillNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Format: YY/MM/HHMMSS
    const billNumber = `${year}${month}/${day}/${hours}${minutes}${seconds}`;
    
    // Format assessment number to match bill number format: YY/MM/HHMMSS
    const assessmentNumber = `${year}${month}/${day}/${hours}${minutes}${seconds}`;
    
    return { billNumber, assessmentNumber };
  };

  // Update the handleRadioChange function
  const handleRadioChange = (event) => {
    if (event.target.value === "old") {
      setpropType(false);
      setSelectedBillNo("");
      setassmtNo("");
      setGeneratedAssessmentNo("");
    }
    if (event.target.value === "new") {
      setpropType(true);
      const { billNumber, assessmentNumber } = generateBillNumber();
      setSelectedBillNo(billNumber);
      setGeneratedAssessmentNo(assessmentNumber);
      
      // Clear other fields
      setSelectedDoorNo("");
      setSelectedOwner("");
      setselectedAreaofplot("");
      setSelectedMobile("");
      setSelectedZone("");
      setOldassmtNo("");
      setusagename("");
    }
  };

  // Add this to your state declarations at the top of the component
  const [generatedAssessmentNo, setGeneratedAssessmentNo] = useState("");

  // Define fetchGisIds inside the component
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
        return {
          success: true,
          surveyorSubmitted: {
            ward001: data.surveyor_submitted.ward01 || [],
            ward014: data.surveyor_submitted.ward14 || [],
            ward016: data.surveyor_submitted.ward16 || [],
            ward035: data.surveyor_submitted.ward35 || [],
            ward036: data.surveyor_submitted.ward36 || [],
            ward041: data.surveyor_submitted.ward41 || []
          },
          verified: {
            ward001: data.verified.ward01 || [],
            ward014: data.verified.ward14 || [],
            ward016: data.verified.ward16 || [],
            ward035: data.verified.ward35 || [],
            ward036: data.verified.ward36 || [],
            ward041: data.verified.ward41 || []
          },
          adminVerified: {
            ward001: data.admin_verified.ward01 || [],
            ward014: data.admin_verified.ward14 || [],
            ward016: data.admin_verified.ward16 || [],
            ward035: data.admin_verified.ward35 || [],
            ward036: data.admin_verified.ward36 || [],
            ward041: data.admin_verified.ward41 || []
          },
          sadminVerified: {
            ward001: data.sadmin_verified.ward01 || [],
            ward014: data.sadmin_verified.ward14 || [],
            ward016: data.sadmin_verified.ward16 || [],
            ward035: data.sadmin_verified.ward35 || [],
            ward036: data.sadmin_verified.ward36 || [],
            ward041: data.sadmin_verified.ward41 || []
          }
        };
      } else {
        console.error('Failed to fetch GIS IDs:', data.message);
        return {
          success: false,
          surveyorSubmitted: {},
          verified: {},
          adminVerified: {},
          sadminVerified: {}
        };
      }
    } catch (error) {
      console.error('Error fetching GIS IDs:', error);
      return {
        success: false,
        surveyorSubmitted: {},
        verified: {},
        adminVerified: {},
        sadminVerified: {}
      };
    }
  };

  // Helper function to get GIS IDs from localStorage with specific naming
  const getGisIdsFromStorage = (type, ward) => {
    try {
      const paddedWard = ward.padStart(3, '0'); // Convert ward number to 3 digits
      const key = `${type}_reviewed_${ward}_gisId`;
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

  // Update the useEffect for GIS IDs initialization
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

  // Add this to your existing state declarations
  const [profTaxOptions, setProfTaxOptions] = useState([]);
  const [profTaxLoading, setProfTaxLoading] = useState(false);
  const [profTaxError, setProfTaxError] = useState(null);

  // Add this useEffect to fetch prof tax numbers
  useEffect(() => {
    const fetchProfTaxNumbers = async () => {
      setProfTaxLoading(true);
      setProfTaxError(null);
      
      try {
        const response = await fetch("https://luisnellai.xyz/siraj/getProfTaxNumbers.php", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setProfTaxOptions(data.profTaxNumbers);
          console.log(`Loaded ${data.count} prof tax numbers`);
        } else {
          throw new Error(data.message || 'Failed to load prof tax numbers');
        }
      } catch (error) {
        console.error('Error fetching prof tax numbers:', error);
        setProfTaxError(error.message);
        message.error('Failed to load prof tax numbers');
      } finally {
        setProfTaxLoading(false);
      }
    };

    fetchProfTaxNumbers();
  }, []); // Empty dependency array means this runs once on component mount

  // Add this new state to track the selected GIS info
  const [selectedGisInfo, setSelectedGisInfo] = useState('');

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">PROPERTY INFORMATION</Typography>
          <Button
            style={{ color: "white"}}
            onClick={gotomap}
          >
            MAP
          </Button>
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
                      value={Gisid}
                      onChange={handleGisIdChange}
                      variant="outlined"
                      InputProps={{
                        endAdornment: gisIdSource === 'map' ? (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: 'green',
                            fontSize: '0.8rem',
                            '& > span': {
                              backgroundColor: '#e8f5e9',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap'
                            }
                          }}>
                            <span>✓ From Map</span>
                          </Box>
                        ) : null
                      }}
                    />
                  </FormControl>
                </Col>
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
                        value="Split Building"
                        control={<Radio />}
                        label="Split Building"
                      />
                      <FormControlLabel
                        value="Merge Building"
                        control={<Radio />}
                        label="Merge Building"
                      />
                      <FormControlLabel 
                        value="No Correction"
                        control={<Radio />}
                        label="No Correction"
                      />
                    </RadioGroup>
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
                
                <Col md={6} className="mt-3">
                  <FormControl fullWidth>
                    <InputLabel>Construction Type</InputLabel>
                    <Select
                      label="Construction Type"
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
                    {/*   
                  <TextField
                    label="Building Used As"
                    variant="outlined"
                    value={usagename}
                    onChange={(e) =>
                      setSelectedBuildingUsedAs(e.target.value)
                    }
                    disabled
                  /> */}
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
              <Row className="mt-3">
              <Col md={6} className="mt-3">
              {proptype ? (
                <FormControl fullWidth className="mt-3">
                  <TextField
                    label="Ward Number"
                    variant="outlined"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                  />
                                        
                </FormControl>
              ) : (
                <FormControl fullWidth className="mt-3">
                  <Autocomplete
                      options={wardOptions}
                      value={selectedWard}
                      onChange={(e, newValue) => setSelectedWard(newValue)}
                      renderInput={(params) => <TextField {...params} label="Ward No" variant="outlined" />}
                    />
                </FormControl>
              )}
                </Col>
                <Col md={6} className="mt-3">
                {proptype ? (
                <FormControl fullWidth className="mt-3">
                  <TextField
                    label="Road Name"
                    variant="outlined"
                    value={selectedStreet}
                    onChange={(e) => setSelectedStreet(e.target.value)}
                  />
                                        
                </FormControl>
              ) : (
                <FormControl fullWidth className="mt-3">
                  <Autocomplete
                      options={streetOptions}
                      value={selectedStreet}
                      onChange={(e, newValue) => setSelectedStreet(newValue)}
                      renderInput={(params) => <TextField {...params} label="Road Name" variant="outlined" />}
                      // disabled={!selectedWard}
                    />
                </FormControl>
              )}
                </Col>
                <Col md={6}>
                {proptype ? (
                <FormControl fullWidth className="mt-3">
                  <TextField
                    label="Bill Number"
                    variant="outlined"
                    value={selectedBillNo}
                    onChange={(e) => setSelectedBillNo(e.target.value)}
                  />
                                        
                </FormControl>
              ) : (
                <FormControl fullWidth className="mt-3">
                  <Autocomplete
                    options={assessmentOptions}
                    value={selectedBillNo}
                    onChange={(e, newValue) => setSelectedBillNo(newValue)}
                    renderInput={(params) => <TextField {...params} label="Bill Number" variant="outlined" />}
                  />
                </FormControl>
              )}
                </Col>
                <Col md={6}>
                  <FormControl fullWidth className="mt-3">
                    <TextField
                      label="Door Number"
                      variant="outlined"
                      value={selectedDoorNo}
                      onChange={(e) => setSelectedDoorNo(e.target.value)}
                      // disabled
                    />
                  </FormControl>
                </Col>
        
          
                
                <Col md={6} className="mt-3">
                  {/* Edit Details Button */}
                  {proptype ? (
                    <></>
              ) : (
                <Button variant="outlined" color="primary"  onClick={handleOpenDialog} 
                disabled={!selectedBillNo} >
                  Edit Details
                </Button>
              )}

                  {/* Dialog for Editing Ward and Street */}
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Ward and Street for <b>{selectedBillNo}</b></DialogTitle>
                    <DialogContent>
                      {/* Input for Editing Ward */}
                      <TextField
                        label="Edit Ward"
                        value={editedWard}
                        onChange={handleWardChange}
                        fullWidth
                        margin="normal"
                      />
                      {/* Input for Editing Street */}
                      <TextField
                        label="Edit Street"
                        value={editedStreet}
                        onChange={handleStreetChange}
                        fullWidth
                        margin="normal"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitEdit} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                {proptype ? (
                <FormControl fullWidth className="mt-3">
                  <TextField
                    label="Name of Assessee"
                    variant="outlined"
                    value={selectedOwner}
                    onChange={(e) => setSelectedOwner(e.target.value)}
                  />
                                        
                </FormControl>
              ) : (
                <FormControl fullWidth className="mt-3">
                  <Autocomplete
                    options={OwnerOptions}
                    value={selectedOwner}
                    onChange={(_, newValue) => setSelectedOwner(newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Name of Assessee" 
                        variant="outlined"
                        error={!selectedOwner && activeStep === 0}
                        helperText={!selectedOwner && activeStep === 0 ? "Name of Assessee is required" : ""}
                      />
                    )}
                  />
                </FormControl>
              )}
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
                      // disabled
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
                      // disabled
                    />
                  </FormControl>
                </Col>
              </Row>
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
                          value={index === 0 ? selectedAreaofplot : floor.area} // Use selectedAreaofplot for first floor only
                          onChange={(e) => handleFloorChange(floor.id, e)}
                          disabled={index === 0} 
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
                          label="Percentage Used"
                          name="flatNo"
                          variant="outlined"
                          value={floor.flatNo}
                          onChange={(e) => {
                            handleFloorChange(floor.id, e);
                            const percentage = e.target.value;
                            const baseArea = index === 0 ? selectedAreaofplot : floor.area; // Use floor's area for non-first floors
                            const calculated = (baseArea * percentage) / 100;
                            setCalculatedValues(prev => ({
                              ...prev,
                              [floor.id]: calculated
                            }));
                          }}
                        />
                        <p>{calculatedValues[floor.id] ? `${calculatedValues[floor.id]} Sqft` : ''}</p>
                      </FormControl>
                    </Col>
                     <Col md={6}>
                      <FormControl fullWidth className="mt-3">
                        <Autocomplete
                          options={profTaxOptions}
                          value={floor.profTaxNo || ''}
                          onChange={(e, newValue) => {
                            handleFloorChange(floor.id, {
                              target: { name: 'profTaxNo', value: newValue }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`Prof Tax No for Floor ${floor.floor || index + 1}`}
                              variant="outlined"
                            />
                          )}
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
            <Typography variant="h5">Upload Image</Typography>
            <Box mt={3}>
              {/* <Row>
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
              </Row> */}
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
                disabled={loading || !selectedFile}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                Final Submit
              </Button>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
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
                  disabled={nextLoading}
                  startIcon={nextLoading && <CircularProgress size={20} color="inherit" />}
                >
                  Next
                </Button>
              )}
            </Col>
          </Row>
        </Box>
      </Container>
      <Dialog 
        open={openMapDialog} 
        onClose={handleCloseMapDialog}
        maxWidth="md" // Makes dialog wider
        fullWidth={true} // Takes up maximum width defined by maxWidth
        PaperProps={{
          style: {
            minHeight: '60vh', // Makes dialog taller
            padding: '20px', // Adds padding inside dialog
            borderRadius: '10px' // Rounds the corners
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
    </div>
  );
}

export default PropertyDetails;