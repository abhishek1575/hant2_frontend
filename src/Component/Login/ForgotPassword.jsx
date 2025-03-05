import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Grid2,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ceinsys_logo from "../Image/ceinsys_logo.png"; // Replace with the logo for your tool
import ForgotPasswordServices from "../../Service/ForgotPasswordServices"; // Import the service

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        toast.warning("All fields are required.");
      } else if (password !== confirmPassword) {
        toast.warning("Passwords do not match.");
      } else {
        await ForgotPasswordServices.resetPassword(email, password); // Call the API service
        toast.success("Password changed successfully!");
        setTimeout(() => {
          navigate("/login"); // Redirect to login after successful password reset
        }, 2000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password!");
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "0px",
        backdropFilter: "blur(10px)",
        background: "linear-gradient(135deg, #3095f0, #b6bced, #fdf9fd)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid2 container spacing={0} sx={{ overflowY: "auto" }}>
        <Grid2 item xs={false} md={3} lg={3} xl={3} />
        <Grid2
          item
          xs={12}
          md={6}
          lg={6}
          xl={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              width: "100%",
              maxWidth: 400,
              position: "relative",
              "@media (max-width:400px)": {
                position: "static",
                transform: "none",
                mx: "auto",
              },
            }}
          >
            {/* Logo */}
            <div style={{ margin: "8px", textAlign: "center" }}>
              <img
                src={ceinsys_logo}
                alt="Logo"
                style={{
                  width: "200px",
                  height: "80px",
                  display: "inline-block",
                }}
              />
            </div>

            <Typography variant="h5" component="h1" textAlign="center">
              Forgot Password?
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                id="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    "&:hover": {
                      boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  Submit
                </Button>
                <ToastContainer />
              </div>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ForgotPassword;
