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
} from "@mui/material";

const SViewSurvey = () => {
  const { user_id } = useParams();
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {  
      try {
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
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        if (data.status === "success") {
          setTask(data.tasks || []);
        } else {
          throw new Error(data.message || "Failed to fetch tasks");
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user_id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  return (
    <Container>
      <Card variant="outlined" style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" component="h3" style={{ marginTop: "20px" }}>
            Assigned Task Information
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="building-table">
              <TableHead>
                <TableRow>
                  <TableCell>User Id</TableCell>
                  <TableCell>Ward Name</TableCell>
                  <TableCell>Street Name</TableCell>
                  <TableCell>Assessment No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell>{property.user_id}</TableCell>
                    <TableCell>{property.WardName}</TableCell>
                    <TableCell>{property.StreetName}</TableCell>
                    <TableCell>{property.AssesmentNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SViewSurvey;
