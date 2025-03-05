import React from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddUserForm from "./AddUser";
import UserTable from "./UserTable";
import Available from "../../Component/Admin/dashboard/Available";

const Modals = ({
  addUserModal,
  userTableModal,
  openAvailableForm,
  selectedItem,
  openChangePasswordModal,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  handleClose,
  handleCloseChangePasswordModal,
  handleChangePasswordSubmit,
  getAllData,
}) => {
  return (
    <>
      {/* Add User Modal */}
      <Modal open={addUserModal} onClose={null} closeAfterTransition>
        <Box sx={modalBoxStyle}>
          <CloseButton onClick={() => handleClose("AddUserModal")} />
          <AddUserForm
            handleClose={() => handleClose("AddUserModal")}
            getAllData={getAllData}
          />
        </Box>
      </Modal>

      {/* User Table Modal */}
      <Modal open={userTableModal} onClose={null} closeAfterTransition>
        <Box sx={modalBoxStyle}>
          <CloseButton onClick={() => handleClose("UserTableModal")} />
          <UserTable
            handleClose={() => handleClose("UserTableModal")}
            getAllData={getAllData}
          />
        </Box>
      </Modal>

      {/* Available Modal */}
      <Available
        open={openAvailableForm}
        data={selectedItem}
        handleClose={() => handleClose("AvailableForm")}
        getAllData={getAllData}
      />

      {/* Change Password Modal */}
      <Modal
        open={openChangePasswordModal}
        onClose={handleCloseChangePasswordModal}
        aria-labelledby="change-password-modal-title"
      >
        <Box sx={passwordModalStyle}>
          <CloseButton onClick={handleCloseChangePasswordModal} />
          <Typography
            id="change-password-modal-title"
            variant="h6"
            component="h2"
            mb={2}
          >
            Change Password
          </Typography>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseChangePasswordModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleChangePasswordSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

// Common Styles
const modalBoxStyle = {
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
  position: "relative",
};

const passwordModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// Close Button Component
const CloseButton = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: "#f44336",
      color: "#fff",
      "&:hover": { backgroundColor: "#d32f2f" },
    }}
  >
    <CloseIcon />
  </IconButton>
);

export default Modals;
