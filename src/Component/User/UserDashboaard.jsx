import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Button,
  Menu,
  Modal,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import ceinsys_logo from "../Image/ceinsys_logo.png";
import Available from "../Admin/dashboard/Available";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../Components/ChangePasswordModal";
import { getAllData, changePassword } from "../../Service/DashboardService";
import ItemTableForUser from "./ItemTableForUser";
import { applyFilters } from "../../Components/utils/Filters";
import HistoryTable from "../../Components/HistoryTable";

const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openAvailableForm, setOpenAvailableForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [parentTableData, setParentTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [anchorElLogout, setAnchorElLogout] = useState(null);
  const navigate = useNavigate();
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Error state for password mismatch
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      const data = await getAllData();
      setParentTableData(data);
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Open History Modal
  const handleHistoryClick = () => {
    setOpenHistoryModal(true);
  };

  // Close History Modal
  const handleCloseHistoryModal = () => {
    setOpenHistoryModal(false);
  };

  // Handlers
  const handleMenuCloseLogout = () => {
    setAnchorElLogout(null);
  };
  const handleCategoryAndSubCategoryChange = (event, type) => {
    if (type === "subCategory") {
      const category = event.target.value;
      setSelectedSubCategory(category);
    } else {
      const category = event;
      setSelectedCategory(category);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
  };

  // Effect for filtering table data based on selected category, subcategory, and search value
  useEffect(() => {
    const filteredData = applyFilters(
      parentTableData,
      selectedCategory,
      selectedSubCategory,
      searchValue
    );
    setTableData(filteredData);
  }, [selectedCategory, selectedSubCategory, searchValue, parentTableData]);

  const handleLogoutClick = () => {
    // Clear session and local storage
    sessionStorage.clear();
    localStorage.clear();

    // Perform additional logout actions if needed, such as redirecting
    console.log("Logged out successfully");
    navigate("/login");
    handleMenuCloseLogout();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = (propertyName) => {
    if (propertyName === "AvailableForm") {
      setOpenAvailableForm(false);
    } else {
      setOpen(false);
    }
  };

  // change password
  const handleProfileMenuOpen = (event) => {
    setAnchorElProfile(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  // Open Change Password Modal
  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
    handleProfileMenuClose(); // Close profile menu when opening modal
  };

  // Close Change Password Modal
  const handleCloseChangePasswordModal = () => {
    setOpenChangePasswordModal(false);
  };
  // Handle Change Password Submit
  const handleChangePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and Confirm password do not match!");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      alert("Password changed successfully"); // Show success alert
      handleCloseChangePasswordModal(); // Close modal after success
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Error changing password. Please try again.");
    }
  };
  // Menu Item Selection
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
        }}
      >
        {/* Top App Bar */}
        <AppBar position="fixed" sx={{ backgroundColor: "#3B92CD" }}>
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left Section */}
            <img
              src={ceinsys_logo}
              alt="Ceinsys Logo"
              style={{ height: "40px", marginRight: "16px" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                marginLeft: "140px",
              }}
            >
              <Button color="inherit" onClick={handleMenuOpen}>
                {selectedCategory}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={(e) => {
                    handleCategoryAndSubCategoryChange("All", "Category");
                  }}
                >
                  All
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    handleCategoryAndSubCategoryChange("Asset", "Category");
                  }}
                >
                  Asset
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    handleCategoryAndSubCategoryChange("Component", "Category");
                  }}
                >
                  Component
                </MenuItem>
              </Menu>
              <Button color="inherit" onClick={handleHistoryClick}>
                My History
              </Button>
              {/* <Button color="inherit">History</Button> */}
              {/* <Button color="inherit">Request</Button> */}
              <Typography color="inherit" style={{ marginRight: "6px" }}>
                Contact Us: contact@ceinsys.com
              </Typography>
            </div>

            {/* Right Section */}
            <div>
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>

              {/* Profile Icon - Handles Change Password */}
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <AccountCircleIcon />
              </IconButton>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorElProfile}
                open={Boolean(anchorElProfile)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={handleOpenChangePasswordModal}>
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>

              <ChangePasswordModal
                open={openChangePasswordModal}
                onClose={handleCloseChangePasswordModal}
                onSubmit={handleChangePasswordSubmit}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                error={error}
              />
            </div>
          </Toolbar>
        </AppBar>

        {/* Welcome Section */}
        <div
          style={{
            marginTop: "60px",
            padding: "16px",
            backgroundColor: "#A8D2EF",
          }}
        >
          <Typography variant="h5">
            Welcome {sessionStorage.getItem("Name")}
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
              backgroundColor: "#f5f5f5",
              padding: "8px 12px",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Select
                defaultValue="All"
                value={selectedSubCategory}
                onChange={(e) => {
                  handleCategoryAndSubCategoryChange(e, "subCategory");
                }}
                style={{ marginRight: "16px", width: "120px" }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Mechanics">Tools & Instruments</MenuItem>
              </Select>
              <TextField
                variant="outlined"
                placeholder="Search"
                size="small"
                style={{ marginRight: "16px" }}
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <IconButton color="primary">
                <FilterListIcon />
              </IconButton>
              <IconButton color="primary">
                <ViewListIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div
        style={{
          marginTop: "10px", // Make sure it starts below the welcome message
          padding: "16px",
        }}
      >
        <ItemTableForUser
          tableData={tableData}
          setSelectedItem={setSelectedItem}
          setOpenAvailableForm={setOpenAvailableForm}
          setOpenEditForm={setOpenEditForm}
        />
      </div>

      <Available
        open={openAvailableForm}
        data={selectedItem}
        handleClose={() => handleClose("AvailableForm")}
        getAllData={getAllData}
      />

      {/* History Modal */}
      {/* <Modal
        open={openHistoryModal}
        aria-labelledby="history-modal-title"
        aria-describedby="history-modal-description"
        disableBackdropClick // Prevent closing when clicking outside
        disableEscapeKeyDown // Prevent closing when pressing the Escape key
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%", // Increased width
            maxWidth: "1200px", // Maximum width
            height: "70%", // Increased height
            maxHeight: "800px", // Maximum height
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" id="history-modal-title" gutterBottom>
            User History
          </Typography>
          <HistoryTable onClose={handleCloseHistoryModal} />
        </Box>
      </Modal> */}

      <Modal
        open={openHistoryModal}
        aria-labelledby="history-modal-title"
        aria-describedby="history-modal-description"
        disableEscapeKeyDown
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            maxWidth: "1200px",
            height: "auto",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            p: 4,
          }}
        >
          <Typography variant="h6" id="history-modal-title" gutterBottom>
            User History
          </Typography>

          <HistoryTable onClose={handleCloseHistoryModal} />
        </Box>
      </Modal>
    </div>
  );
};

export default UserDashboard;
