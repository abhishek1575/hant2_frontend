//latest
import React, { useEffect, useState } from "react";
import {  AppBar,  Toolbar,  Typography, Badge ,IconButton,  Select,  MenuItem,  TextField,  Button,  Modal,  Box,  Menu,} from "@mui/material";
import ChangePasswordModal from "../../../Components/ChangePasswordModal";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import ceinsys_logo from "../../Image/ceinsys_logo.png";
import AddElement from "../dashboard/AddElement";
import HistoryCards from "../dashboard/HistoryCards";
import RequestHistoryModal from "./RequestHistoryModel";
import CloseIcon from "@mui/icons-material/Close";
import EditForm from "./EditForm";
import { useNavigate } from "react-router-dom";
import Available from "./Available";
import { getAllData, changePassword } from "../../../Service/DashboardService";
import ItemTable from "../../../Components/ItemTable";
import { applyFilters } from "../../../Components/utils/Filters";
import { fetchNewRequests } from "../../../Service/DashboardService";
import HistoryTable from "../../../Components/HistoryTable";
import DeletedItemsTable from "../../../Components/DeletedItemsTable";

const Dashboard2 = () => {
  const navigate = useNavigate();

  // State variables
  const [open, setOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAvailableForm, setOpenAvailableForm] = useState(false);
  const [openHistoryCards, setHistoryCards] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [parentTableData, setParentTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [anchorElLogout, setAnchorElLogout] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Error state for password mismatch
  const [anchorElProfile, setAnchorElProfile] = useState(null); // Profile dropdown
  const [openModal, setOpenModal] = useState(false);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openDeletedModel, setDeletedModel] = useState(false);
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

  //request history model
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Open User History Modal
  const handleHistoryClick = () => {
    setOpenHistoryModal(true);
  };

  // Close User History Modal
  const handleCloseHistoryModal = () => {
    setOpenHistoryModal(false);
  };

  // Handlers
  const handleMenuOpenLogout = (event) => {
    setAnchorElLogout(event.currentTarget);
  };

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

  //Notification for new requests/ Function to fetch new requests and update state
  // Use effect to check for new requests every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchNewRequests();
      setHasNewRequests(result);
    };

    fetchData(); // Fetch on component mount
   
  }, []);


  // Handle Modal Open and Close
  const handleOpen = () => setOpen(true);
  const handleClose = (propertyName) => {
    if (propertyName === "EditForm") {
      setOpenEditForm(false);
    } else if (propertyName === "AvailableForm") {
      setOpenAvailableForm(false);
    } else if (propertyName === "HistoryCards") {
      setHistoryCards(false);
    } else {
      setOpen(false);
    }
  };

  // Menu Item Selection
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
              <Button color="inherit" onClick={handleOpenModal}>
                Activity Log
              </Button>

              <Button color="inherit" onClick={handleOpen}>
                Add Item
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  setHistoryCards(true);
                }}
              >
                Manage Requests
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
              <IconButton color="inherit" onClick={() => setDeletedModel(true)}>
                <ViewListIcon />
              </IconButton>
              <IconButton color="inherit">
                <Badge color="error" variant="dot" invisible={!hasNewRequests}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile Icon - Handles Change Password */}
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <AccountCircleIcon />
              </IconButton>

              {/* Change Password Dropdown Menu */}
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
                autoComplete="off"
                inputProps={{
                  autoComplete: "off",
                  name: "searchInput", // Change input name to a non-common name
                  id: "searchInput", // Ensure unique ID to prevent browser autofill tracking
                }}
                onFocus={(e) => e.target.setAttribute("autocomplete", "off")} // Prevents autofill on focus
              />
            </div>
            <div>
              <IconButton color="primary">
                <FilterListIcon />
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
        <ItemTable
          tableData={tableData}
          setSelectedItem={setSelectedItem}
          setOpenAvailableForm={setOpenAvailableForm}
          setOpenEditForm={setOpenEditForm}
        />
      </div>
      {/* Add Element Modal  new code */}
      <Modal
        open={open}
        onClose={null} // Prevent closing when clicking outside
        closeAfterTransition
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            boxShadow: 24,
            borderRadius: 3,
            p: 3,
            width: "100%",
            maxWidth: "600px", // Match AddElement width
            maxHeight: "80vh", // Adjust height
            overflowY: "auto",
            position: "relative",
          }}
        >
          {/* Close Icon in the top right corner */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "gray", // Subtle color
              "&:hover": { backgroundColor: "#f0f0f0" }, // Light hover effect
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* AddElement Form */}
          <AddElement
            handleClose={() => {
              handleClose("AddElement");
              getAllData(); // Refresh dashboard data automatically
            }}
            getAllData={getAllData}
          />
        </Box>
      </Modal>
      {/* History Cards Modal */}
      <Modal
        open={openHistoryCards}
        onClose={null} // Prevent closing when clicking outside
        closeAfterTransition
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            width: "60%",
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative", // Add relative positioning to position the close icon
          }}
        >
          {/* Close Icon in the top right corner */}
          <IconButton
            onClick={() => handleClose("HistoryCards")} // Close the modal when clicked
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#f44336", // Red background for the close button
              color: "#fff",
              "&:hover": { backgroundColor: "#d32f2f" }, // Darken red on hover
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Add the form from AddElement */}
          <HistoryCards
            handleClose={() => handleClose("AddElement")}
            getAllData={getAllData}
            data={selectedItem}
          />
        </Box>
      </Modal>
      <EditForm
        open={openEditForm}
        data={selectedItem}
        handleClose={() => handleClose("EditForm")}
        getAllData={getAllData}
      />
      <Available
        open={openAvailableForm}
        data={selectedItem}
        handleClose={() => handleClose("AvailableForm")}
        getAllData={getAllData}
      />

      <RequestHistoryModal open={openModal} handleClose={handleCloseModal} />
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
      {/* Deleted Items Table Component */}
      <DeletedItemsTable
        open={openDeletedModel}
        onClose={() => setDeletedModel(false)}
      />
    </div>
  );
};

export default Dashboard2;


