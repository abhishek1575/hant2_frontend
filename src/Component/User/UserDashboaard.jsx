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
  Container,
  Paper,
  Stack,
  Badge,
  useTheme,
  useMediaQuery,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  GridView,
  TableRows,
} from "@mui/icons-material";
import ceinsys_logo from "../Image/cstechai_transparent.png";
import Available from "../Admin/dashboard/Available";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../Components/ChangePasswordModal";
import { getAllData, changePassword } from "../../Service/DashboardService";
import ItemTableForUser from "./ItemTableForUser";
import ItemCardDashboard from "./ItemCardDashboard";
import { applyFilters } from "../../Components/utils/Filters";
import HistoryTable from "../../Components/HistoryTable";

const UserDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  const [parentTableData, setParentTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [openAvailableForm, setOpenAvailableForm] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  useEffect(() => {
    const filteredData = applyFilters(
      parentTableData,
      selectedCategory,
      selectedSubCategory,
      searchValue
    );
    setTableData(filteredData);
  }, [selectedCategory, selectedSubCategory, searchValue, parentTableData]);

  const handleMenuOpen = (event, setter) => setter(event.currentTarget);
  const handleMenuClose = (setter) => setter(null);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    handleMenuClose(setAnchorEl);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
    handleMenuClose(setProfileAnchorEl);
  };

  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
    handleMenuClose(setProfileAnchorEl);
  };

  const handleChangePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and Confirm password do not match!");
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      alert("Password changed successfully");
      setOpenChangePasswordModal(false);
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Error changing password. Please try again.");
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const renderDesktopMenu = () => (
    <Box
      sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}
    >
      <Button color="inherit" onClick={(e) => handleMenuOpen(e, setAnchorEl)}>
        {selectedCategory}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose(setAnchorEl)}
      >
        <MenuItem onClick={() => handleCategoryChange("All")}>All</MenuItem>
        <MenuItem onClick={() => handleCategoryChange("Asset")}>Asset</MenuItem>
        <MenuItem onClick={() => handleCategoryChange("Component")}>
          Component
        </MenuItem>
      </Menu>
      <Button color="inherit" onClick={() => setOpenHistoryModal(true)}>
        My History
      </Button>
    </Box>
  );

  const renderMobileMenu = () => (
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={(e) => handleMenuOpen(e, setMobileMenuAnchorEl)}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={() => handleMenuClose(setMobileMenuAnchorEl)}
      >
        <MenuItem onClick={() => setOpenHistoryModal(true)}>
          My History
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "grey.50",
      }}
    >
      <AppBar position="sticky" sx={{ bgcolor: "#2c3e50" }}>
        <Toolbar>
          <img
            src={ceinsys_logo}
            alt="Ceinsys Logo"
            style={{ height: "40px", marginRight: "16px" }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HAMT
          </Typography>
          {renderDesktopMenu()}
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={(e) => handleMenuOpen(e, setProfileAnchorEl)}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={() => handleMenuClose(setProfileAnchorEl)}
            >
              <MenuItem onClick={handleOpenChangePasswordModal}>
                Change Password
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
          {renderMobileMenu()}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, md: 3 } }}
      >
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              gutterBottom
            >
              Welcome back, {sessionStorage.getItem("Name") || "User"}! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              Browse and select items from our inventory
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                sx={{
                  minWidth: 180,
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem value="All">All Subcategories</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Mechanics">Tools & Instruments</MenuItem>
              </Select>
              <TextField
                variant="outlined"
                placeholder="Search for items..."
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Paper>

          {/* View Toggle */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="card" aria-label="card view">
                <GridView sx={{ mr: 1 }} /> Cards
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <TableRows sx={{ mr: 1 }} /> Table
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Content */}
          <Paper elevation={2} sx={{ p: { xs: 1, md: 2 }, borderRadius: 2 }}>
            {viewMode === "card" ? (
              <ItemCardDashboard tableData={tableData} />
            ) : (
              <ItemTableForUser
                tableData={tableData}
                setSelectedItem={setSelectedItem}
                setOpenAvailableForm={setOpenAvailableForm}
              />
            )}
          </Paper>
        </Container>
      </Box>

      <Available
        open={openAvailableForm}
        data={selectedItem}
        handleClose={() => setOpenAvailableForm(false)}
        getAllData={fetchData}
      />

      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
        onSubmit={handleChangePasswordSubmit}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        error={error}
      />

      <Modal
        open={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        aria-labelledby="history-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", md: "80%" },
            maxWidth: "1200px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, md: 4 },
          }}
        >
          <Typography variant="h6" id="history-modal-title" gutterBottom>
            My Request History
          </Typography>
          <HistoryTable onClose={() => setOpenHistoryModal(false)} />
        </Box>
      </Modal>
    </Box>
  );
};

export default UserDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Select,
//   MenuItem,
//   TextField,
//   Button,
//   Menu,
//   Modal,
//   Box,
//   Container,
//   Paper,
//   Stack,
//   Badge,
//   useTheme,
//   useMediaQuery,
//   InputAdornment,
// } from "@mui/material";
// import {
//   Notifications as NotificationsIcon,
//   AccountCircle as AccountCircleIcon,
//   Menu as MenuIcon,
//   Search as SearchIcon,
// } from "@mui/icons-material";
// import ceinsys_logo from "../Image/cstechai_transparent.png";
// import Available from "../Admin/dashboard/Available";
// import { useNavigate } from "react-router-dom";
// import ChangePasswordModal from "../../Components/ChangePasswordModal";
// import { getAllData, changePassword } from "../../Service/DashboardService";
// import ItemTableForUser from "./ItemTableForUser";
// import { applyFilters } from "../../Components/utils/Filters";
// import HistoryTable from "../../Components/HistoryTable";

// const UserDashboard = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
//   const [profileAnchorEl, setProfileAnchorEl] = useState(null);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("All");
//   const [searchValue, setSearchValue] = useState("");

//   const [parentTableData, setParentTableData] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const [openAvailableForm, setOpenAvailableForm] = useState(false);
//   const [openEditForm, setOpenEditForm] = useState(false);
//   const [openHistoryModal, setOpenHistoryModal] = useState(false);
//   const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   // Fetch data
//   const fetchData = async () => {
//     try {
//       const data = await getAllData();
//       setParentTableData(data);
//       setTableData(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Effect for filtering
//   useEffect(() => {
//     const filteredData = applyFilters(
//       parentTableData,
//       selectedCategory,
//       selectedSubCategory,
//       searchValue
//     );
//     setTableData(filteredData);
//   }, [selectedCategory, selectedSubCategory, searchValue, parentTableData]);

//   // Handlers
//   const handleMenuOpen = (event, setter) => setter(event.currentTarget);
//   const handleMenuClose = (setter) => setter(null);

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     handleMenuClose(setAnchorEl);
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     navigate("/login");
//     handleMenuClose(setProfileAnchorEl);
//   };

//   const handleOpenChangePasswordModal = () => {
//     setOpenChangePasswordModal(true);
//     handleMenuClose(setProfileAnchorEl);
//   };

//   const handleChangePasswordSubmit = async () => {
//     if (newPassword !== confirmPassword) {
//       setError("New password and Confirm password do not match!");
//       return;
//     }
//     try {
//       await changePassword(oldPassword, newPassword);
//       alert("Password changed successfully");
//       setOpenChangePasswordModal(false);
//     } catch (error) {
//       console.error("Failed to change password:", error);
//       alert("Error changing password. Please try again.");
//     }
//   };

//   const renderDesktopMenu = () => (
//     <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
//       <Button color="inherit" onClick={(e) => handleMenuOpen(e, setAnchorEl)}>
//         {selectedCategory}
//       </Button>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => handleMenuClose(setAnchorEl)}
//       >
//         <MenuItem onClick={() => handleCategoryChange("All")}>All</MenuItem>
//         <MenuItem onClick={() => handleCategoryChange("Asset")}>Asset</MenuItem>
//         <MenuItem onClick={() => handleCategoryChange("Component")}>Component</MenuItem>
//       </Menu>
//       <Button color="inherit" onClick={() => setOpenHistoryModal(true)}>
//         My History
//       </Button>
//       {/* <Typography variant="body2">Contact: contact@ceinsys.com</Typography> */}
//     </Box>
//   );

//   const renderMobileMenu = () => (
//     <Box sx={{ display: { xs: "flex", md: "none" } }}>
//       <IconButton
//         size="large"
//         edge="start"
//         color="inherit"
//         aria-label="menu"
//         onClick={(e) => handleMenuOpen(e, setMobileMenuAnchorEl)}
//       >
//         <MenuIcon />
//       </IconButton>
//       <Menu
//         anchorEl={mobileMenuAnchorEl}
//         open={Boolean(mobileMenuAnchorEl)}
//         onClose={() => handleMenuClose(setMobileMenuAnchorEl)}
//       >
//         <MenuItem onClick={() => setOpenHistoryModal(true)}>My History</MenuItem>
//         {/* <MenuItem>Contact: contact@ceinsys.com</MenuItem> */}
//       </Menu>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "grey.100" }}>
//       <AppBar position="sticky" sx={{ bgcolor: "#2c3e50" }}>
//         <Toolbar>
//           <img src={ceinsys_logo} alt="Ceinsys Logo" style={{ height: "40px", marginRight: "16px" }} />
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             HAMT
//           </Typography>
//           {renderDesktopMenu()}
//           <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <IconButton color="inherit">
//               <Badge badgeContent={4} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//             <IconButton color="inherit" onClick={(e) => handleMenuOpen(e, setProfileAnchorEl)}>
//               <AccountCircleIcon />
//             </IconButton>
//             <Menu
//               anchorEl={profileAnchorEl}
//               open={Boolean(profileAnchorEl)}
//               onClose={() => handleMenuClose(setProfileAnchorEl)}
//             >
//               <MenuItem onClick={handleOpenChangePasswordModal}>Change Password</MenuItem>
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//           </Box>
//           {renderMobileMenu()}
//         </Toolbar>
//       </AppBar>

//       <Box component="main" sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, md: 3 } }}>
//         <Container maxWidth="xl">
//           <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'primary.lightest' }}>
//             <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
//               Welcome, {sessionStorage.getItem("Name") || "User"}!
//             </Typography>
//             <Stack
//               direction={{ xs: "column", sm: "row" }}
//               spacing={2}
//               sx={{ mt: 2, alignItems: 'center' }}
//             >
//               <Select
//                 value={selectedSubCategory}
//                 onChange={(e) => setSelectedSubCategory(e.target.value)}
//                 sx={{ minWidth: 180, bgcolor: 'background.paper' }}
//               >
//                 <MenuItem value="All">All Subcategories</MenuItem>
//                 <MenuItem value="Electronics">Electronics</MenuItem>
//                 <MenuItem value="Mechanics">Tools & Instruments</MenuItem>
//               </Select>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search for items..."
//                 fullWidth
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 sx={{ bgcolor: 'background.paper' }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Stack>
//           </Paper>

//           <Paper elevation={2} sx={{ p: { xs: 1, md: 2 }, borderRadius: 2 }}>
//             <ItemTableForUser
//               tableData={tableData}
//               setSelectedItem={setSelectedItem}
//               setOpenAvailableForm={setOpenAvailableForm}
//               setOpenEditForm={setOpenEditForm}
//             />
//           </Paper>
//         </Container>
//       </Box>

//       <Available
//         open={openAvailableForm}
//         data={selectedItem}
//         handleClose={() => setOpenAvailableForm(false)}
//         getAllData={fetchData}
//       />

//       <ChangePasswordModal
//         open={openChangePasswordModal}
//         onClose={() => setOpenChangePasswordModal(false)}
//         onSubmit={handleChangePasswordSubmit}
//         oldPassword={oldPassword}
//         setOldPassword={setOldPassword}
//         newPassword={newPassword}
//         setNewPassword={setNewPassword}
//         confirmPassword={confirmPassword}
//         setConfirmPassword={setConfirmPassword}
//         error={error}
//       />

//       <Modal
//         open={openHistoryModal}
//         onClose={() => setOpenHistoryModal(false)}
//         aria-labelledby="history-modal-title"
//       >
//         <Box sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: { xs: '95%', md: '80%' },
//             maxWidth: '1200px',
//             maxHeight: '90vh',
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             borderRadius: 2,
//             display: 'flex',
//             flexDirection: 'column',
//             p: { xs: 2, md: 4 }
//         }}>
//           <Typography variant="h6" id="history-modal-title" gutterBottom>
//             My Request History
//           </Typography>
//           <HistoryTable onClose={() => setOpenHistoryModal(false)} />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default UserDashboard;
