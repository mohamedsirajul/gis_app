import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Box,
  Pagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

const ViewSurvey = () => {
  const { user_id } = useParams();
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [removing, setRemoving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(0);

  const handleBack = () => {
    window.location.href = "/users";
  };

  useEffect(() => {
    fetchTasks();
  }, [user_id]);

  useEffect(() => {
    setTotalPages(Math.ceil(tasks.length / perPage));
  }, [tasks, perPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePerPageChange = (event) => {
    setPerPage(event.target.value);
    setPage(1);
  };

  const getCurrentTasks = () => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return tasks.slice(startIndex, endIndex);
  };

  const getRecordsInfo = () => {
    const startIndex = (page - 1) * perPage + 1;
    const endIndex = Math.min(page * perPage, tasks.length);
    return `Showing ${startIndex} - ${endIndex} of ${tasks.length} records`;
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
     const response = await fetch(
          `https://luisnellai.xyz/siraj/admin/get_assigned_task.php/${user_id}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0"
            },
            credentials: 'omit' // Important for CORS
          }
        );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.status === "success") {
        setTask(data.tasks || []);
      } else {
        throw new Error(data.message || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setSelectedWard("");
    setSelectedStreet("");
    setOpenDialog(true);
  };

  const handleRemove = async () => {
    if (!selectedWard || !selectedStreet) {
      setNotification({ open: true, message: 'Please select ward and street', severity: 'error' });
      return;
    }

    setRemoving(true);
    try {
      const tasksToRemove = tasks.filter(task => 
        task.WardName === selectedWard && 
        task.StreetName === selectedStreet
      );

      const assessmentNumbers = tasksToRemove.map(task => task.AssesmentNo);

      if (assessmentNumbers.length === 0) {
        throw new Error("No tasks found to remove");
      }

      const postData = {
        user_id: user_id,
        ward_name: selectedWard,
        street_name: selectedStreet,
        assessment_numbers: assessmentNumbers
      };

      console.log('Sending data:', postData);

      const response = await fetch('https://luisnellai.xyz/siraj/admin/remove_assinedtask.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setNotification({ open: true, message: 'Tasks removed successfully', severity: 'success' });
        setTask(prevTasks => prevTasks.filter(task => 
          !(task.WardName === selectedWard && task.StreetName === selectedStreet)
        ));
        setOpenDialog(false);
      } else {
        throw new Error(result.message || 'Failed to remove tasks');
      }
    } catch (error) {
      console.error('Error removing tasks:', error);
      setNotification({ 
        open: true, 
        message: error.message || 'Error removing tasks', 
        severity: 'error' 
      });
    } finally {
      setRemoving(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    fetchTasks();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        }}
      >
        <CircularProgress size={60} style={{ color: "#eb3f2f" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Container>
        <Alert severity="info">No tasks assigned for User ID: {user_id}</Alert>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Assigned Task Information</Typography>
        </Toolbar>
      </AppBar>
      <br />
      <Container>
        <Card variant="outlined" style={{ marginTop: "20px" }}>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography variant="h6" component="h3">
                Assigned Task Information
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleEditClick}
              >
                Edit Assigned Task
              </Button>
            </div>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <FormControl variant="outlined" size="small">
                <InputLabel>Rows per page</InputLabel>
                <Select
                  value={perPage}
                  onChange={handlePerPageChange}
                  label="Rows per page"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                  <MenuItem value={500}>500</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary">
                {getRecordsInfo()}
              </Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="building-table">
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Ward Name</TableCell>
                    <TableCell>Street Name</TableCell>
                    <TableCell>Assessment No</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCurrentTasks().map((property, index) => (
                    <TableRow key={index}>
                      <TableCell>{(page - 1) * perPage + index + 1}</TableCell>
                      <TableCell>{property.WardName}</TableCell>
                      <TableCell>{property.StreetName}</TableCell>
                      <TableCell>{property.AssesmentNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>

            <Dialog 
              open={openDialog} 
              onClose={handleDialogClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Edit Assigned Task</DialogTitle>
              <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Ward</InputLabel>
                  <Select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                  >
                    {[...new Set(tasks.map(task => task.WardName))].map((ward) => (
                      <MenuItem key={ward} value={ward}>
                        {ward}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Street</InputLabel>
                  <Select
                    value={selectedStreet}
                    onChange={(e) => setSelectedStreet(e.target.value)}
                    disabled={!selectedWard}
                  >
                    {tasks
                      .filter(task => task.WardName === selectedWard)
                      .map(task => task.StreetName)
                      .filter((street, index, self) => self.indexOf(street) === index)
                      .map((street) => (
                        <MenuItem key={street} value={street}>
                          {street}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} disabled={removing}>Cancel</Button>
                <Button 
                  onClick={handleRemove} 
                  color="error"
                  disabled={!selectedWard || !selectedStreet || removing}
                >
                  {removing ? <CircularProgress size={24} /> : 'Remove Street Tasks'}
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
      />
    </>
  );
};

export default ViewSurvey;
