import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
// import Avatar from "@mui/material/Avatar";

import { styled } from "@mui/material/styles";

import bgimage from "../background.jpg";
const Home = () => {
  const navigate = useNavigate();
  const [loginPath, setLoginPath] = React.useState("");

  const handleChange = (event) => {
    const path = event.target.value;
    setLoginPath(path);
    navigate(path);
  };

  const StyledAvatar = styled(LockIcon)(({ theme }) => ({
    width: theme.spacing(10),
    height: theme.spacing(10),
    // backgroundColor: theme.palette.secondary.main,
    "& img": {
      width: "100%",
      height: "auto",
      borderRadius: "50%",
    },
  }));

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Typography variant="h5">
        <b>GIS Tax Navigator</b>
      </Typography>
      <StyledAvatar />

      <br />
      <FormControl
        variant="outlined"
        sx={{
          width: "300px",
          borderRadius: 1,
          mb: 4,
          //   boxShadow: 3,
        }}
      >
        <InputLabel id="login-select-label" style={{ color: "black" }}>
          Choose Login Type
        </InputLabel>
        <Select
          labelId="login-select-label"
          value={loginPath}
          onChange={handleChange}
          label="Login"
          //   style={{
          //     background: "linear-gradient(to bottom right, #e0f7fa, #cfd9df)",
          //   }}
          sx={{
            // background: "linear-gradient(to bottom right, #ffffff, #f0f4f7)",
            border: "1px solid black",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value="/user_login">Surveyor Login</MenuItem>
          <MenuItem value="/admin_login">Admin Login</MenuItem>
          <MenuItem value="/sadmin_login">Super Admin Login</MenuItem>
          <MenuItem value="/fadadmin_login">ATE Admin Login</MenuItem>
          <MenuItem value="/vfa_admin_login">ATCR Admin Login</MenuItem>
          <MenuItem value="/verification">Verification Login</MenuItem>
          <MenuItem value="/admin_verification">Admin Verification Login</MenuItem>
          <MenuItem value="/sadmin_verification">Super Admin Verification Login</MenuItem>
        </Select>
      </FormControl>
      {/* <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          py: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2024 Terralens Innovations Private Limited. All rights reserved.
        </Typography>
      </Box> */}
    </Box>
  );
};

export default Home;
