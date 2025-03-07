import React, { useState, useEffect } from "react";
import {
  Grid,
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { requestItem } from "../../../Service/services";
import { useNavigate } from "react-router-dom";

const Available = ({ open, handleClose, data, getAllData }) => {
  const [formData, setFormData] = useState(data);
  const [availableForm, setAvailableForm] = useState({
    userName: sessionStorage.getItem("Name"),
    returnDate: "", // New return date field
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Data received in Available modal:", data);
    setFormData(data);
    // Reset return date when item changes
    setAvailableForm((prev) => ({
      ...prev,
      returnDate: "",
    }));
  }, [data]);

  const handleChange = (e) => {
    setAvailableForm({
      ...availableForm,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let tempErrors = {};

    if (
      !availableForm.quantityRequested ||
      availableForm.quantityRequested < 1
    ) {
      tempErrors.quantityRequested = "Quantity requested must be at least 1";
    } else if (availableForm.quantityRequested > formData?.stock) {
      tempErrors.quantityRequested =
        "Requested quantity exceeds available stock";
    }

    if (!availableForm.projectName)
      tempErrors.projectName = "Project name is required";
    if (!availableForm.remark) tempErrors.remark = "Remark is required";

    // Validate returnDate if item is returnable
    if (formData?.isReturnable && !availableForm.returnDate) {
      tempErrors.returnDate = "Return date is required for returnable items";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    if (!validate()) return;

    try {
      const userId = sessionStorage.getItem("UserId");
      const dataToUpload = {
        id: data.id,
        ...availableForm,
        returnDate: formData?.isReturnable ? availableForm.returnDate : null,
        userId: userId ? parseInt(userId) : null,
        item: {
          id: data.id, // Ensure this matches Postman
        },
      };
      console.log("Data to upload:", JSON.stringify(dataToUpload, null, 2)); // Log the payload
      await requestItem(dataToUpload);
      handleClose();
      alert("Request added successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {}} // Prevent closing on backdrop click
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          onClick: (e) => e.stopPropagation(), // Prevent backdrop click from closing
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 3, // Reduced padding
          width: "40%", // Adjusted width for a standard modal size
          maxWidth: "500px", // Maximum width to avoid overly large modals
          borderRadius: 2,
          overflowY: "auto", // Add scroll if content overflows
          maxHeight: "90vh", // Limit height to 90% of viewport height
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Issue Item</Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              p: 0.5, // Smaller padding for the close icon
              "&:hover": { backgroundColor: "transparent" }, // Remove hover effect
            }}
          >
            <CloseIcon fontSize="small" /> {/* Smaller close icon */}
          </IconButton>
        </Box>

        {/* Item Details */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Component Name: {formData?.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", marginTop: 1 }}
          >
            Value: {formData?.value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", marginTop: 1 }}
          >
            Specification: {formData?.description}
          </Typography>
        </Box>

        {/* Form Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="quantityRequested"
              label="Requested Quantity"
              value={availableForm?.quantityRequested || ""}
              onChange={handleChange}
              error={!!errors.quantityRequested}
              helperText={errors.quantityRequested}
              sx={{ mb: 2, width: "100%" }}
              size="small" // Smaller input size
              required
            />
            <TextField
              name="projectName"
              label="Project Name"
              value={availableForm?.projectName || ""}
              onChange={handleChange}
              error={!!errors.projectName}
              helperText={errors.projectName}
              required
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
            <TextField
              name="remark"
              label="Remark"
              value={availableForm?.remark || ""}
              onChange={handleChange}
              error={!!errors.remark}
              helperText={errors.remark}
              sx={{ mb: 2, width: "100%" }}
              size="small"
              required
            />

            {/* Show return date field only if item is returnable */}
            {formData?.isReturnable && (
              <TextField
                name="returnDate"
                label="Return Date"
                type="datetime-local"
                value={availableForm?.returnDate || ""}
                onChange={handleChange}
                error={!!errors.returnDate}
                helperText={errors.returnDate}
                sx={{ mb: 2, width: "100%" }}
                size="small"
                required
                InputLabelProps={{ shrink: true }} // Ensure label does not overlap
              />
            )}
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            size="small" // Smaller button size
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Available;
