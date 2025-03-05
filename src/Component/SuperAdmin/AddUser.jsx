import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Config from "../../Service/Config";

const AddUserForm = () => {
  const [name, setName] = useState(""); // Dummy data
  const [email, setEmail] = useState(""); // Dummy data
  const [password, setPassword] = useState(""); // Dummy data
  const [role, setRole] = useState("USER"); // Default role
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    try {
      setLoading(true);

      const response = await fetch(`${Config.API_BASE_URL}api/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User added successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setRole("USER");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "24px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Shadow for depth
        borderRadius: "8px", // Rounded corners
        backgroundColor: "#fff", // White background
        display: "flex",
        flexDirection: "column",
        gap: "16px", // Spacing between elements
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: "#1976d2" }} // Bold heading with primary color
      >
        Add User
      </Typography>
      <TextField
        label="Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        InputProps={{
          style: {
            padding: "10px",
          },
        }}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        InputProps={{
          style: {
            padding: "10px",
          },
        }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          style: {
            padding: "10px",
          },
        }}
      />
      <FormControl fullWidth>
        <InputLabel id="role-select-label">Role</InputLabel>
        <Select
          labelId="role-select-label"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{
            padding: "5px",
            borderRadius: "8px",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.2)", // Shadow for the select box
          }}
        >
          <MenuItem value="USER">USER</MenuItem>
          <MenuItem value="ADMIN">ADMIN</MenuItem>
          <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{
          fontSize: "16px",
          padding: "10px",
          backgroundColor: "#1976d2",
          ":hover": {
            backgroundColor: "#155a9c", // Hover effect for the button
          },
        }}
      >
        {loading ? "Adding User..." : "Add User"}
      </Button>
    </Box>
  );
};

export default AddUserForm;
