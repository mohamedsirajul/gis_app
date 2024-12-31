import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  AppBar,
  Toolbar,
  Typography,
  Button as MUIButton,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

function Addcsv() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvHeaders(results.meta.fields);
          setCsvData(results.data);
        },
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", selectedFile);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://luisnellai.xyz/siraj/addcsv.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.success || response.data.error);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("super_admin_token");
  //   window.location.href = "/sadmin_login";
  // };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h3>Upload Property CSV</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload CSV File</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Uploading...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </Form>
            {csvData.length > 0 && (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    {csvHeaders.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {csvHeaders.map((header, colIndex) => (
                        <td key={colIndex}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Addcsv;
