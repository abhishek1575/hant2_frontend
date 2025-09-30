import React, { useEffect, useState } from "react";
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
import ceinsys_logo from "../Image/cstechai_transparent.png";
import { useNavigate } from "react-router-dom";
import { getAllData, changePassword } from "../../Service/DashboardService";
import ChangePasswordModal from "../../Components/ChangePasswordModal";
import ItemTableForUser from "../../Component/User/ItemTableForUser";
import { applyFilters } from "../../Components/utils/Filters";
import Modals from "./Model";
import HistoryTable from "../../Components/HistoryTable";

const Dashboard2 = () => {
  const [open, setOpen] = useState(false);
  const [parentTableData, setParentTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null); // Profile dropdown
  const [anchorElLogout, setAnchorElLogout] = useState(null);
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Error state for password mismatch
  const [openEditForm, setOpenEditForm] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [userTableModal, setUserTableModal] = useState(false);
  const [openAvailableForm, setOpenAvailableForm] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const handleClose = (modalName) => {
    if (modalName === "AddUserModal") setAddUserModal(false);
    if (modalName === "UserTableModal") setUserTableModal(false);
    if (modalName === "AvailableForm") setOpenAvailableForm(false);
    if (modalName === "ChangePasswordModal") setOpenChangePasswordModal(false);
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

  // Menu Item Selection
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleMenuClose();
  };

  const fetchData = async () => {
    try {
      const data = await getAllData();
      setParentTableData(data);
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              {/* <Button color="inherit">History</Button> */}
              <Button color="inherit" onClick={() => setAddUserModal(true)}>
                Add USER
              </Button>
              <Button color="inherit" onClick={() => setUserTableModal(true)}>
                USER TABLE
              </Button>
              <Button color="inherit" onClick={handleHistoryClick}>
                My History
              </Button>
              <Typography color="inherit" style={{ marginRight: "16px" }}>
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

      {/* Table Section with Fixed Header */}
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
        {/* Other dashboard content */}

        <Modals
          addUserModal={addUserModal}
          userTableModal={userTableModal}
          openAvailableForm={openAvailableForm}
          selectedItem={selectedItem}
          openChangePasswordModal={openChangePasswordModal}
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          handleClose={handleClose}
          handleCloseChangePasswordModal={handleCloseChangePasswordModal}
          handleChangePasswordSubmit={handleChangePasswordSubmit}
          getAllData={getAllData}
        />
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
    </div>
  );
};

export default Dashboard2;
