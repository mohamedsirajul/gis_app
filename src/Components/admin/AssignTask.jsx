import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  ListItemText,
  Checkbox,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AssignTask = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStreets, setSelectedStreets] = useState([]);
  const [taskData, setTaskData] = useState({
    WardName: "",
    StreetName: [],
  });
  const [additionalSelections, setAdditionalSelections] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://luisnellai.xyz/siraj/admin/getUserbyId.php/${user_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchProperties = async () => {
      try {
        const response = await fetch('https://luisnellai.xyz/siraj/getproperty.php', {
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
        console.log('Current properties:', data);
        setProperties(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
    fetchProperties();
  }, [user_id]);

  useEffect(() => {
    console.log('Current properties:', properties);
  }, [properties]);

  const handleWardChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index === null) {
      setTaskData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      const filteredProps = properties.filter(
        (property) => property.WardName === value
      );
      console.log(filteredProps);
      setFilteredProperties(filteredProps);
      setSelectedStreets([]);
    } else {
      const newAdditionalSelections = [...additionalSelections];
      newAdditionalSelections[index].WardName = value;
      newAdditionalSelections[index].StreetName = [];
      setAdditionalSelections(newAdditionalSelections);

      updateFilteredProperties(newAdditionalSelections);
    }
  };

  const handleStreetChange = (event, index = null) => {
    const {
      target: { value },
    } = event;

    if (index === null) {
      if (value.includes("All")) {
        const allStreets = getFilteredStreets(taskData.WardName);
        setSelectedStreets(
          selectedStreets.length === allStreets.length ? [] : allStreets
        );

        const filteredProps = properties.filter(
          (property) =>
            property.WardName === taskData.WardName &&
            allStreets.includes(property.StreetName)
        );
        setFilteredProperties(filteredProps);
      } else {
        setSelectedStreets(
          typeof value === "string" ? value.split(",") : value
        );

        const filteredProps = properties.filter(
          (property) =>
            property.WardName === taskData.WardName &&
            value.includes(property.StreetName)
        );
        setFilteredProperties(filteredProps);
      }
    } else {
      const newAdditionalSelections = [...additionalSelections];
      newAdditionalSelections[index].StreetName =
        typeof value === "string" ? value.split(",") : value;

      setAdditionalSelections(newAdditionalSelections);

      updateFilteredProperties(newAdditionalSelections);
    }
  };

  // const addNewSelection = () => {
  //   const alreadySelectedWards = [
  //     taskData.WardName,
  //     ...additionalSelections.map((selection) => selection.WardName),
  //   ];
  //   const availableWards = uniqueWards.filter(
  //     (ward) => !alreadySelectedWards.includes(ward)
  //   );

  //   if (availableWards.length > 0) {
  //     setAdditionalSelections([
  //       ...additionalSelections,
  //       { WardName: availableWards[0], StreetName: [] },
  //     ]);
  //   }
  // };
  const addNewSelection = () => {
    const alreadySelectedWards = additionalSelections.map(
      (selection) => selection.WardName
    );

    const availableWards = uniqueWards.filter(
      (ward) => !alreadySelectedWards.includes(ward)
    );

    if (availableWards.length > 0) {
      setAdditionalSelections((prevSelections) => [
        ...prevSelections,
        { WardName: availableWards[0], StreetName: [] },
      ]);
    } else {
      alert("All wards are already selected.");
    }
  };

  const updateFilteredProperties = (newSelections) => {
    let newFilteredProperties = properties.filter(
      (property) =>
        property.WardName === taskData.WardName &&
        selectedStreets.includes(property.StreetName)
    );

    newSelections.forEach((selection) => {
      const additionalFilteredProps = properties.filter(
        (property) =>
          property.WardName === selection.WardName &&
          selection.StreetName.includes(property.StreetName)
      );
      newFilteredProperties = [
        ...newFilteredProperties,
        ...additionalFilteredProps,
      ];
    });

    setFilteredProperties(newFilteredProperties);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add validation check
    if (filteredProperties.length === 0) {
      alert("Please select at least one property before assigning the task.");
      return;
    }

    setLoading(true);

    const combinedStreetNames = [
      ...selectedStreets,
      ...additionalSelections.flatMap((selection) => selection.StreetName),
    ];

    console.log(filteredProperties);
    
    const postData = {
      user_id,
      properties: filteredProperties,
      created_at: new Date().toISOString(),
    };
    console.log(postData);

    // Example fetch request (uncomment and customize as needed)
    try {
      const response = await fetch(
        "https://luisnellai.xyz/siraj/admin/task_assigned.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }

      const result = await response.json();
      alert("Task assigned successfully");
      setLoading(false);
      window.location.href = "/users";
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  const handleBack = () => {
    window.location.href = "/users";
  };
  if (loading) {
    return (
      <Container sx={{ textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center" }}>
        <Alert severity="error">Error: {error.message}</Alert>
      </Container>
    );
  }

  const uniqueWards = [
    ...new Set(properties.map((property) => property.WardName)),
  ];

  const getFilteredStreets = (wardName) => {
    return [
      ...new Set(
        properties
          .filter((property) => property.WardName === wardName)
          .map((property) => property.StreetName)
      ),
    ];
  };

  const filteredStreets = getFilteredStreets(taskData.WardName);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Assign Task</Typography>
        </Toolbar>
      </AppBar>
      <br />
      <Container>
        <h1>Assign Task</h1>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="WardName-label">Ward Name</InputLabel>
          <Select
            labelId="WardName-label"
            id="WardName"
            name="WardName"
            value={taskData.WardName}
            onChange={(e) => handleWardChange(e)}
            required
          >
            <MenuItem value="">
              <em>Select Ward</em>
            </MenuItem>
            {uniqueWards.map((ward) => (
              <MenuItem key={ward} value={ward}>
                {ward}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="StreetName-label">Street Name</InputLabel>
          <Select
            labelId="StreetName-label"
            id="StreetName"
            name="StreetName"
            multiple
            value={selectedStreets}
            onChange={(e) => handleStreetChange(e)}
            input={<OutlinedInput label="Street Name" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            <MenuItem value="All">
              <Checkbox
                checked={selectedStreets.length === filteredStreets.length}
                indeterminate={
                  selectedStreets.length > 0 &&
                  selectedStreets.length < filteredStreets.length
                }
                onChange={(e) =>
                  setSelectedStreets(e.target.checked ? filteredStreets : [])
                }
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {filteredStreets.map((street) => (
              <MenuItem key={street} value={street}>
                <Checkbox checked={selectedStreets.indexOf(street) > -1} />
                <ListItemText primary={street} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {additionalSelections.map((selection, index) => {
          const additionalFilteredStreets = getFilteredStreets(
            selection.WardName
          );

          return (
            <div key={index}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id={`additional-ward-${index}`}>
                  Ward Name
                </InputLabel>
                <Select
                  labelId={`additional-ward-${index}`}
                  id={`additional-ward-${index}`}
                  name="WardName"
                  value={selection.WardName}
                  onChange={(e) => handleWardChange(e, index)}
                  required
                  disabled={additionalSelections.some(
                    (s, idx) =>
                      s.WardName == selection.WardName && idx !== index
                  )}
                >
                  <MenuItem value="">
                    <em>Select Ward</em>
                  </MenuItem>
                  {uniqueWards
                    .filter((ward) => ward !== taskData.WardName)
                    .map((ward) => (
                      <MenuItem key={ward} value={ward}>
                        {ward}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id={`additional-street-${index}`}>
                  Street Name
                </InputLabel>
                <Select
                  labelId={`additional-street-${index}`}
                  id={`additional-street-${index}`}
                  name="StreetName"
                  multiple
                  value={selection.StreetName}
                  onChange={(e) => handleStreetChange(e, index)}
                  input={<OutlinedInput label="Street Name" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="All">
                    <Checkbox
                      checked={
                        selection.StreetName.length ===
                        additionalFilteredStreets.length
                      }
                      indeterminate={
                        selection.StreetName.length > 0 &&
                        selection.StreetName.length <
                          additionalFilteredStreets.length
                      }
                      onChange={(e) =>
                        setAdditionalSelections((prev) =>
                          prev.map((s, idx) =>
                            idx === index
                              ? {
                                  ...s,
                                  StreetName: e.target.checked
                                    ? additionalFilteredStreets
                                    : [],
                                }
                              : s
                          )
                        )
                      }
                    />
                    <ListItemText primary="Select All" />
                  </MenuItem>
                  {additionalFilteredStreets.map((street) => (
                    <MenuItem key={street} value={street}>
                      <Checkbox
                        checked={selection.StreetName.includes(street)}
                      />
                      <ListItemText primary={street} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          );
        })}

        <Button variant="contained" onClick={addNewSelection} sx={{ mb: 2 }}>
          Add Ward and Street
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property ID</TableCell>
                <TableCell>Ward Name</TableCell>
                <TableCell>Street Name</TableCell>
                <TableCell>Assessment Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.s_no}</TableCell>
                  <TableCell>{property.WardName}</TableCell>
                  <TableCell>{property.StreetName}</TableCell>
                  <TableCell>{property.AssesmentNo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Assign Task
        </Button>
      </Container>
    </>
  );
};

export default AssignTask;
