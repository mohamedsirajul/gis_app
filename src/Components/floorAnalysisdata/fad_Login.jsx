import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
// import jwtDecode from "jwt-decode"; // Ensure correct import

const defaultTheme = createTheme();

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  backgroundColor: "#f05b4d",
  "& img": {
    width: "100%",
    height: "auto",
    borderRadius: "50%",
  },
}));

export default function FadAdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      const emailError = validateEmail(value);
      setError(null);
      setErrors({ ...errors, email: emailError });
    }

    if (name === "password") {
      const passwordError = validatePassword(value);
      setErrors({ ...errors, password: passwordError });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = formData;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({ email: "", password: "" });
    setLoading(true);

    try {
      const response = await fetch(
        `https://luisnellai.xyz/siraj/admin/fad_login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      if (data.status === "success") {
        const token = data.token;
        localStorage.setItem("fad_token", token);

        window.location.href = "/fad";
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!isValidEmail(email)) return "Invalid email format.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 2) return "Password must be at least 2 characters.";
    return "";
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StyledAvatar />
          <Typography component="h3" variant="h5">
            ATE Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#A2A08B",
                },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#A2A08B",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#A2A08B",
                },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#A2A08B",
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
              }}
              style={{
                backgroundColor: "#f05b4d",
                color: "white",
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
