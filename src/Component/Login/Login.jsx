import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Service/AuthService";
import { Snackbar, Alert } from "@mui/material";
import ceinsys_logo from "../Image/cstechai_transparent.png";
import "./Login.css"; // Import the CSS file

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      if (response.data.jwt) {
        sessionStorage.setItem("token", response.data.jwt);
        sessionStorage.setItem("Role", response.data.role);
        sessionStorage.setItem("isLoggedIn", "true");
        setError("");
        setShowError(false);
        switch (response.data.role) {
          case "ADMIN":
            navigate("/adashboard");
            break;
          case "USER":
            navigate("/udashboard");
            break;
          case "SUPER_ADMIN":
            navigate("/sdashboard");
            break;
          default:
            throw new Error("Unknown role");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
      setShowError(true);
    }
  };

  const handleSnackbarClose = () => {
    setShowError(false);
  };

  return (
    <div className="login-container">
      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <div className="logo-container">
        <img src={ceinsys_logo} alt="Ceinsys Logo" className="logo" />
      </div>

      <h1 className="main-heading">Hardware Asset Management Tool</h1>

      <div className="login-section">
        <h2 className="login-title">Login Here</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            GET STARTED
          </button>
        </form>
        <a href="/forgotpassword" className="forgot-password">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}

export default Login;
