import React, { useState, useEffect } from "react";
import {
  Grid,
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateItem, deleteItem } from "../../../Service/services";

const EditForm = ({ open, handleClose, data, getAllData }) => {
  const [formData, setFormData] = useState(data);
 

  // Update formData when data changes
  useEffect(() => {
    setFormData({ ...data });
  }, [data]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle isReturnable change
  const handleIsReturnableChange = (e) => {
    const value = e.target.value === "true"; // Convert string to boolean
    setFormData({
      ...formData,
      isReturnable: value,
    });
  };

  // Handle subCategory change
  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      subCategory: value === "Electronics" ? "Electronics" : "Mechanics",
    });
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      category: value,
    });
  };

  // Save changes
  const handleSave = async () => {
    try {
      await updateItem(formData);
     
      handleClose();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete item
  const handleDelete = async () => {
    try {
      await deleteItem(formData.id);
      
      handleClose();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
          maxWidth: "600px", // Maximum width to avoid overly large modals
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
          <Typography variant="h6">Edit Item</Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              p: 0.5, // Smaller padding for the close icon
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" }, // Subtle hover effect
            }}
          >
            <CloseIcon fontSize="small" /> {/* Smaller close icon */}
          </IconButton>
        </Box>

        {/* Grid Layout for Form Fields */}
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={6}>
            <TextField
              name="name"
              label="Component Name"
              value={formData.name || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small" // Smaller input size
            />
            <TextField
              name="value"
              label="Value"
              value={formData.value || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
            <TextField
              name="description"
              label="Specification"
              value={formData.description || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />

            {/* SubCategory Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Sub Category</InputLabel>
              <Select
                name="subCategory"
                value={formData.subCategory || ""}
                onChange={handleSubCategoryChange}
                label="Sub Category"
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Tools & Instruments">
                  Tools & Instruments
                </MenuItem>
              </Select>
            </FormControl>

            {/* Category Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category || ""}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="Asset">Asset</MenuItem>
                <MenuItem value="Component">Component</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="manufacturer"
              label="MFG/Supplier"
              value={formData.manufacturer || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={6}>
            <TextField
              name="location"
              label="Location"
              value={formData.location || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
            <TextField
              name="package_box"
              label="Package Box"
              value={formData.package_box || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
            <TextField
              name="mpn"
              label="MPN"
              value={formData.mpn || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
            <TextField
              name="sap_no"
              label="SAP No"
              value={formData.sap_no || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
            <TextField
              name="stock"
              label="Stock"
              value={formData.stock || ""}
              onChange={handleChange}
              sx={{ mb: 2, width: "100%" }}
              size="small"
            />
            {/* Dropdown for isReturnable */}
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Is Returnable</InputLabel>
              <Select
                name="isReturnable"
                value={formData.isReturnable?.toString() || "false"} // Convert boolean to string
                onChange={handleIsReturnableChange}
                label="Is Returnable"
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            size="small"
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            size="small"
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditForm;

// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   Modal,
//   Box,
//   TextField,
//   Button,
//   IconButton,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { updateItem, deleteItem } from "../../../Service/services";

// const EditForm = ({ open, handleClose, data, getAllData }) => {
//   const [formData, setFormData] = useState(data);

//   // Update formData when data changes
//   useEffect(() => {
//     setFormData({ ...data });
//   }, [data]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle isReturnable change
//   const handleIsReturnableChange = (e) => {
//     const value = e.target.value === "true"; // Convert string to boolean
//     setFormData({
//       ...formData,
//       isReturnable: value,
//     });
//   };

//   // Save changes
//   const handleSave = async () => {
//     try {
//       await updateItem(formData);
//       await getAllData(); // Ensure data updates before closing modal
//       handleClose();
//     } catch (error) {
//       console.error("Error updating item:", error);
//     }
//   };

//   // Delete item
//   const handleDelete = async () => {
//     try {
//       await deleteItem(formData.id);
//       await getAllData(); // Ensure data updates before closing modal
//       handleClose();
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           bgcolor: "white",
//           boxShadow: 24,
//           p: 3, // Reduced padding
//           width: "40%", // Adjusted width for a standard modal size
//           maxWidth: "600px", // Maximum width to avoid overly large modals
//           borderRadius: 2,
//           overflowY: "auto", // Add scroll if content overflows
//           maxHeight: "90vh", // Limit height to 90% of viewport height
//         }}
//       >
//         {/* Modal Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6">Edit Item</Typography>
//           <IconButton
//             onClick={handleClose}
//             sx={{
//               p: 0.5, // Smaller padding for the close icon
//               "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" }, // Subtle hover effect
//             }}
//           >
//             <CloseIcon fontSize="small" /> {/* Smaller close icon */}
//           </IconButton>
//         </Box>

//         {/* Grid Layout for Form Fields */}
//         <Grid container spacing={2}>
//           {/* Left Column */}
//           <Grid item xs={6}>
//             <TextField
//               name="name"
//               label="Component Name"
//               value={formData.name || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small" // Smaller input size
//             />
//             <TextField
//               name="value"
//               label="Value"
//               value={formData.value || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             <TextField
//               name="description"
//               label="Specification"
//               value={formData.description || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             <TextField
//               name="subCategory"
//               label="Sub Category"
//               value={formData.subCategory || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             <TextField
//               name="manufacturer"
//               label="MFG/Supplier"
//               value={formData.manufacturer || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//           </Grid>

//           {/* Right Column */}
//           <Grid item xs={6}>
//             <TextField
//               name="location"
//               label="Location"
//               value={formData.location || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             <TextField
//               name="package_box"
//               label="Package Box"
//               value={formData.package_box || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             <TextField
//               name="mpn"
//               label="MPN"
//               value={formData.mpn || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             <TextField
//               name="sap_no"
//               label="SAP No"
//               value={formData.sap_no || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             <TextField
//               name="stock"
//               label="Stock"
//               value={formData.stock || ""}
//               onChange={handleChange}
//               sx={{ mb: 2, width: "100%" }}
//               size="small"
//             />
//             {/* Dropdown for isReturnable */}
//             <FormControl fullWidth sx={{ mb: 2 }} size="small">
//               <InputLabel>Is Returnable</InputLabel>
//               <Select
//                 name="isReturnable"
//                 value={formData.isReturnable?.toString() || "false"} // Convert boolean to string
//                 onChange={handleIsReturnableChange}
//                 label="Is Returnable"
//               >
//                 <MenuItem value="true">Yes</MenuItem>
//                 <MenuItem value="false">No</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>

//         {/* Buttons */}
//         <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             size="small" // Smaller button size
//           >
//             Save
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleDelete}
//             size="small" // Smaller button size
//           >
//             Delete
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default EditForm;
