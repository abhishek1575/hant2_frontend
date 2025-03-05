import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import Config from "../../../Service/Config";

const AddElement = ({ handleClose, getAllData }) => {
  const [category, setCategory] = useState("Category");
  const [subCategory, setSubCategory] = useState("Sub Category");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sap_no: "",
    value: "",
    manufacturer: "",
    package_box: "",
    location: "",
    mpn: "",
    stock: "",
    isReturnable: false, // Default to false
  });

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    sap_no: false,
    value: false,
    manufacturer: false,
    package_box: false,
    location: false,
    mpn: false,
    stock: false,
  });

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
  };

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    setErrors({ ...errors, [field]: false });
  };

  // Handle Returnable Option Change
  const handleReturnableChange = (event) => {
    setFormData({ ...formData, isReturnable: event.target.value === "true" });
  };

  const isFormValid = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = true;
      valid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = true;
      valid = false;
    }
    if (category === "Category") {
      valid = false;
    }
    if (subCategory === "Sub Category") {
      valid = false;
    }
    if (!formData.value.trim()) {
      newErrors.value = true;
      valid = false;
    }
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = true;
      valid = false;
    }
    if (!formData.location.trim()) {
      newErrors.location = true;
      valid = false;
    }
    if (!formData.stock.trim()) {
      newErrors.stock = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleSubmit = async () => {
    if (isFormValid()) {
      const dataToSubmit = {
        ...formData,
        category,
        subCategory,
        isReturnable: formData.isReturnable, // Ensuring it's boolean
      };

      const token = sessionStorage.getItem("token");

      try {
        const response = await fetch(`${Config.API_BASE_URL}item/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          throw new Error("Failed to submit the form");
        }
        getAllData();
        handleClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the form. Please try again.");
      }
    } else {
      alert("Please fill out all mandatory fields.");
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "500px", // Adjust modal width
        margin: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
        Add New Element
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Asset Name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleInputChange("name")}
            error={errors.name}
            helperText={errors.name ? "Asset Name is required" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Value"
            variant="outlined"
            fullWidth
            value={formData.value}
            onChange={handleInputChange("value")}
            error={errors.value}
            helperText={errors.value ? "Value is required" : ""}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={formData.description}
            onChange={handleInputChange("description")}
            error={errors.description}
            helperText={errors.description ? "Description is required" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={subCategory}
              onChange={handleSubCategoryChange}
              label="Sub Category"
            >
              <MenuItem value="Sub Category" disabled>
                Sub Category
              </MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Mechanics">Tools & Instruments</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="Category" disabled>
                Category
              </MenuItem>
              <MenuItem value="Asset">Asset</MenuItem>
              <MenuItem value="Component">Component</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Manufacturer"
            variant="outlined"
            fullWidth
            value={formData.manufacturer}
            onChange={handleInputChange("manufacturer")}
            error={errors.manufacturer}
            helperText={errors.manufacturer ? "Manufacturer is required" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={formData.location}
            onChange={handleInputChange("location")}
            error={errors.location}
            helperText={errors.location ? "Location is required" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Package Box"
            variant="outlined"
            fullWidth
            value={formData.package_box}
            onChange={handleInputChange("package_box")}
            error={errors.package_box}
            helperText={errors.package_box ? "Package Box is required" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="MPN"
            variant="outlined"
            fullWidth
            value={formData.mpn}
            onChange={handleInputChange("mpn")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="SAP NO"
            variant="outlined"
            fullWidth
            value={formData.sap_no}
            onChange={handleInputChange("sap_no")}
            error={errors.sap_no}
            helperText={errors.sap_no ? "SAP NO is required" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Stock"
            variant="outlined"
            fullWidth
            value={formData.stock}
            onChange={handleInputChange("stock")}
            error={errors.stock}
            helperText={errors.stock ? "Stock is required" : ""}
          />
        </Grid>

        {/* Is Returnable Radio Button */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Is Returnable?</Typography>
            <RadioGroup
              row
              value={formData.isReturnable.toString()}
              onChange={handleReturnableChange}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{ width: "100%", maxWidth: "200px" }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AddElement;
