import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  IconButton,
  Button,
  Modal,
  Box,
  Menu,
  CssBaseline,
  Stack,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ListSubheader,
  Tooltip,
  Container,
  Fab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ViewList as ViewListIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Password as PasswordIcon,
  FileUpload as FileUploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import AddElement from "../dashboard/AddElement";
import HistoryCards from "../dashboard/HistoryCards";
import RequestHistoryModal from "./RequestHistoryModel";
import EditForm from "./EditForm";
import Available from "./Available";
import ChangePasswordModal from "../../../Components/ChangePasswordModal";
import DashboardContent from "./DashboardContent";
import HistoryTable from "../../../Components/HistoryTable";
import DeletedItemsTable from "../../../Components/DeletedItemsTable";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../Service/AuthService";

// Import your services
import { getAllData, changePassword } from "../../../Service/DashboardService";
import { importItems } from "../../../Service/services";
import { fetchNewRequests } from "../../../Service/DashboardService";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: { xs: 2, sm: 3, md: 4 },
  width: { xs: "90%", md: "60%" },
  maxWidth: "1200px",
  maxHeight: "90vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);

  // State variables
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAvailableForm, setOpenAvailableForm] = useState(false);
  const [openHistoryCards, setHistoryCards] = useState(false);
  const [parentTableData, setParentTableData] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElHistory, setAnchorElHistory] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openDeletedModel, setDeletedModel] = useState(false);

  // Data fetching and effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllData();
        setParentTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [
    openEditForm,
    openAvailableForm,
    openHistoryCards,
    openModal,
    openDeletedModel,
    open,
  ]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchNewRequests();
      setHasNewRequests(result);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleMenuOpen = (event, setAnchorEl) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = (setAnchorEl) => setAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose(setAnchorElProfile);
    if (window.confirm("Are you sure you want to log out?")) {
      AuthService.logout();
      navigate("/login");
    }
  };

  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
    handleMenuClose(setAnchorElProfile);
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

  const handleModalClose = (setter) => setter(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await importItems(file);
      alert(response.message || "Items imported successfully!");
      const data = await getAllData();
      setParentTableData(data);
    } catch (error) {
      console.error("Error importing items:", error);
      alert(
        "Failed to import items. Check the file format or console for details."
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem>
          <Typography variant="h6">Menu</Typography>
        </ListItem>
        <Divider />
        <ListSubheader>Actions</ListSubheader>
        <ListItemButton
          onClick={() => {
            setOpen(true);
            toggleDrawer(false)();
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Item" />
        </ListItemButton>
        <ListItemButton onClick={() => fileInputRef.current?.click()}>
          <ListItemIcon>
            <FileUploadIcon />
          </ListItemIcon>
          <ListItemText primary="Import from Excel" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            setHistoryCards(true);
            toggleDrawer(false)();
          }}
        >
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Requests" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            setOpenModal(true);
            toggleDrawer(false)();
          }}
        >
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Activity Log" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            setOpenHistoryModal(true);
            toggleDrawer(false)();
          }}
        >
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="My History" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            setDeletedModel(true);
            toggleDrawer(false)();
          }}
        >
          <ListItemIcon>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary="Deleted Items" />
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => {
            setOpenChangePasswordModal(true);
            toggleDrawer(false)();
          }}
        >
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItemButton>
        <ListItemButton onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "grey.50" }}>
      <CssBaseline />

      {/* AppBar - Fixed */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#3B92CD",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          {!isMobile ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Add a new item">
                <Button
                  color="inherit"
                  startIcon={<AddIcon />}
                  onClick={() => setOpen(true)}
                >
                  Add Item
                </Button>
              </Tooltip>
              <Tooltip title="Import items from Excel">
                <Button
                  color="inherit"
                  startIcon={<FileUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import
                </Button>
              </Tooltip>
              <Tooltip title="View request history">
                <Button
                  color="inherit"
                  startIcon={<DescriptionIcon />}
                  onClick={() => setHistoryCards(true)}
                >
                  Requests
                </Button>
              </Tooltip>
              <Tooltip title="View activity logs">
                <IconButton
                  color="inherit"
                  onClick={(e) => handleMenuOpen(e, setAnchorElHistory)}
                >
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElHistory}
                open={Boolean(anchorElHistory)}
                onClose={() => handleMenuClose(setAnchorElHistory)}
              >
                <ListItemButton
                  onClick={() => {
                    setOpenModal(true);
                    handleMenuClose(setAnchorElHistory);
                  }}
                >
                  Activity Log
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    setOpenHistoryModal(true);
                    handleMenuClose(setAnchorElHistory);
                  }}
                >
                  My History
                </ListItemButton>
              </Menu>
              <Tooltip title="View deleted items">
                <IconButton
                  color="inherit"
                  onClick={() => setDeletedModel(true)}
                >
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasNewRequests}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile settings">
                <IconButton
                  color="inherit"
                  onClick={(e) => handleMenuOpen(e, setAnchorElProfile)}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElProfile}
                open={Boolean(anchorElProfile)}
                onClose={() => handleMenuClose(setAnchorElProfile)}
              >
                <ListItemButton onClick={handleOpenChangePasswordModal}>
                  Change Password
                </ListItemButton>
                <ListItemButton onClick={handleLogoutClick}>
                  Logout
                </ListItemButton>
              </Menu>
            </Stack>
          ) : (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasNewRequests}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      {/* Main Content - Scrollable */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          mt: "64px",
          overflow: "hidden",
        }}
      >
        {/* Content Area - Only Cards Scroll */}
        <DashboardContent
          tableData={parentTableData}
          setSelectedItem={setSelectedItem}
          setOpenEditForm={setOpenEditForm}
          setOpenAvailableForm={setOpenAvailableForm}
        />
      </Box>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Hidden File Input for Excel Import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept=".xlsx, .xls"
      />

      {/* Modals */}
      <Modal open={open} onClose={() => handleModalClose(setOpen)}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => handleModalClose(setOpen)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <AddElement handleClose={() => handleModalClose(setOpen)} />
        </Box>
      </Modal>

      <Modal
        open={openHistoryCards}
        onClose={() => handleModalClose(setHistoryCards)}
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => handleModalClose(setHistoryCards)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <HistoryCards
            handleClose={() => handleModalClose(setHistoryCards)}
            data={selectedItem}
          />
        </Box>
      </Modal>

      <EditForm
        open={openEditForm}
        data={selectedItem}
        handleClose={() => handleModalClose(setOpenEditForm)}
      />
      <Available
        open={openAvailableForm}
        data={selectedItem}
        handleClose={() => handleModalClose(setOpenAvailableForm)}
      />
      <RequestHistoryModal
        open={openModal}
        handleClose={() => handleModalClose(setOpenModal)}
      />

      <Modal
        open={openHistoryModal}
        onClose={() => handleModalClose(setOpenHistoryModal)}
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => handleModalClose(setOpenHistoryModal)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            My History
          </Typography>
          <HistoryTable onClose={() => handleModalClose(setOpenHistoryModal)} />
        </Box>
      </Modal>

      <DeletedItemsTable
        open={openDeletedModel}
        onClose={() => handleModalClose(setDeletedModel)}
      />

      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => handleModalClose(setOpenChangePasswordModal)}
        onSubmit={handleChangePasswordSubmit}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        error={error}
      />
    </Box>
  );
};

export default AdminDashboard;
