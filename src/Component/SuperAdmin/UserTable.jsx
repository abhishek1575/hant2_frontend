//latest running code
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Config from "../../Service/Config";

const UserTable = () => {
  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false); // Modal open/close state
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open/close state
  const [currentUser, setCurrentUser] = useState(null); // Currently selected user for editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [userToDelete, setUserToDelete] = useState(null); // User selected for deletion

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUserToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const getUsersData = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${Config.API_BASE_URL}api/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        response
          .json()
          .then((data) => {
            console.log("Data is ", data);
            setUsers(data); // Assuming the data format matches the state you want
          })
          .catch((error) => {
            console.error("Error reading response body:", error);
          });
        handleClose();
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${Config.API_BASE_URL}api/modifyUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: currentUser.id, ...formData }),
      });

      if (response.ok) {
        alert("User updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === currentUser.id ? { ...user, ...formData } : user
          )
        );
        handleClose();
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  const confirmDelete = (id) => {
    setUserToDelete(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${Config.API_BASE_URL}api/deleteUser?id=${userToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Correctly wrapped in backticks
          },
        }
      );

      if (response.ok) {
        alert("User deleted successfully");
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userToDelete)
        );
        handleDialogClose();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: "24px",
          padding: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          borderRadius: "12px",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "16px", color: "#333" }}
        >
          User Management Table
        </h2>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f5f5f5",
              }}
            >
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "16px" }}
              >
                ID
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "16px" }}
              >
                Name
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "16px" }}
              >
                Email
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "16px" }}
              >
                Role
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "16px" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <TableCell align="center" sx={{ padding: "12px" }}>
                  {user.id}
                </TableCell>
                <TableCell align="center" sx={{ padding: "12px" }}>
                  {user.name}
                </TableCell>
                <TableCell align="center" sx={{ padding: "12px" }}>
                  {user.email}
                </TableCell>
                <TableCell align="center" sx={{ padding: "12px" }}>
                  {user.role}
                </TableCell>
                <TableCell align="center" sx={{ padding: "12px" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      marginRight: "8px",
                      textTransform: "capitalize",
                      borderRadius: "20px",
                    }}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: "lightcoral",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                      textTransform: "capitalize",
                      borderRadius: "20px",
                    }}
                    onClick={() => confirmDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Editing */}
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            // Prevent closing when clicking on the backdrop
            return;
          }
          handleClose();
        }}
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Dimmed backdrop
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            outline: "none", // Removes blue border
          }}
        >
          {/* Cancel Arrow */}
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              minWidth: "32px",
              height: "32px",
              borderRadius: "50%",
              padding: 0,
              backgroundColor: "#f5f5f5",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
                lineHeight: "1",
              }}
            >
              &times;
            </span>
          </Button>

          <h3 style={{ textAlign: "center" }}>Edit User</h3>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
            </Select>
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Confirmation Dialog for Deletion */}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
