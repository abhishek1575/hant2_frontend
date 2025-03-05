import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalComponent = ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={null} closeAfterTransition>
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
        }}
      >
        {/* Close Icon in the top right corner */}
        <IconButton
          onClick={onClose}
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

        {/* Modal Content */}
        {children}
      </Box>
    </Modal>
  );
};

export default ModalComponent;
