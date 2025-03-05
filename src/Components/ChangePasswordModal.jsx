// import { useState } from "react";
// import { changePassword } from "../../../Service/DashboardService"; // Ensure this function exists
// import { Modal, Box, Typography, TextField, Button } from "@mui/material";

// const ChangePasswordModal = ({ open, onClose }) => {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(""); // Error message state

//   const handleChangePasswordSubmit = async () => {
//     if (newPassword !== confirmPassword) {
//       setError("New password and Confirm password do not match!");
//       return;
//     }

//     try {
//       await changePassword(oldPassword, newPassword);
//       alert("Password changed successfully"); // Show success alert
//       onClose(); // Close modal
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setError("");
//     } catch (error) {
//       console.error("Failed to change password:", error);
//       alert("Error changing password. Please try again.");
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="change-password-modal-title"
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 400,
//           bgcolor: "background.paper",
//           border: "2px solid #000",
//           boxShadow: 24,
//           p: 4,
//           borderRadius: 2,
//         }}
//       >
//         <Typography id="change-password-modal-title" variant="h6" mb={2}>
//           Change Password
//         </Typography>
//         <TextField
//           label="Old Password"
//           type="password"
//           fullWidth
//           value={oldPassword}
//           onChange={(e) => setOldPassword(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           label="New Password"
//           type="password"
//           fullWidth
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           label="Confirm Password"
//           type="password"
//           fullWidth
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           margin="normal"
//           error={!!error} // Show red outline if error exists
//           helperText={error} // Display error message below input
//         />
//         <Box mt={2} display="flex" justifyContent="flex-end">
//           <Button onClick={onClose} sx={{ mr: 2 }}>
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={handleChangePasswordSubmit}>
//             Submit
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default ChangePasswordModal;


import { useState } from "react";
import { changePassword } from "../Service/DashboardService";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const ChangePasswordModal = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and Confirm password do not match!");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      alert("Password changed successfully");
      handleClose(); // Close modal only via the Cancel button
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Error changing password. Please try again.");
    }
  };

  // Explicit close handler (only allows closing through Cancel button)
  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose(); // Ensures closure only when called explicitly
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      aria-labelledby="change-password-modal-title"
    >
      <Box
        sx={{
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
        }}
      >
        <Typography id="change-password-modal-title" variant="h6" mb={2}>
          Change Password
        </Typography>
        <TextField
          label="Old Password"
          type="password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          margin="normal"
          autoComplete="off"
          
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          error={!!error}
          helperText={error}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleChangePasswordSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
