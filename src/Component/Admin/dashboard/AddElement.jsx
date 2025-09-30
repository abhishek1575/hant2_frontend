import React, { useState } from "react";
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
  FormLabel,
  Stack,
  Divider,
} from "@mui/material";
import Config from "../../../Service/Config";

const AddElement = ({ handleClose }) => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
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
    isReturnable: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const handleReturnableChange = (event) => {
    setFormData({ ...formData, isReturnable: event.target.value === "true" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Asset Name is required";
    if (!category) newErrors.category = "Category is required";
    if (!subCategory) newErrors.subCategory = "Sub Category is required";
    if (!formData.value.trim()) newErrors.value = "Value is required";
    if (!formData.manufacturer.trim()) newErrors.manufacturer = "Manufacturer is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.stock.trim()) newErrors.stock = "Stock is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill out all mandatory fields.");
      return;
    }

    const dataToSubmit = { ...formData, category, subCategory };
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
      
      handleClose(); // Close modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add New Item
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Asset Name" required fullWidth size="small" value={formData.name} onChange={handleInputChange("name")} error={!!errors.name} helperText={errors.name} />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth required error={!!errors.category} size="small">
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="Asset">Asset</MenuItem>
              <MenuItem value="Component">Component</MenuItem>
            </Select>
            {errors.category && <Typography variant="caption" color="error">{errors.category}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth required error={!!errors.subCategory} size="small">
            <InputLabel>Sub Category</InputLabel>
            <Select value={subCategory} label="Sub Category" onChange={(e) => setSubCategory(e.target.value)}>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Mechanics">Tools & Instruments</MenuItem>
            </Select>
            {errors.subCategory && <Typography variant="caption" color="error">{errors.subCategory}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="Value" required fullWidth size="small" value={formData.value} onChange={handleInputChange("value")} error={!!errors.value} helperText={errors.value} />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField label="Manufacturer" required fullWidth size="small" value={formData.manufacturer} onChange={handleInputChange("manufacturer")} error={!!errors.manufacturer} helperText={errors.manufacturer} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="Stock" required fullWidth type="number" size="small" value={formData.stock} onChange={handleInputChange("stock")} error={!!errors.stock} helperText={errors.stock} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="Location" required fullWidth size="small" value={formData.location} onChange={handleInputChange("location")} error={!!errors.location} helperText={errors.location} />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField label="MPN" fullWidth size="small" value={formData.mpn} onChange={handleInputChange("mpn")} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="SAP NO" fullWidth size="small" value={formData.sap_no} onChange={handleInputChange("sap_no")} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="Package Box" fullWidth size="small" value={formData.package_box} onChange={handleInputChange("package_box")} />
        </Grid>

        <Grid item xs={12}>
          <TextField label="Description" fullWidth multiline rows={2} size="small" value={formData.description} onChange={handleInputChange("description")} error={!!errors.description} helperText={errors.description} />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" size="small">
            <FormLabel component="legend" sx={{fontSize: '0.8rem'}}>Is this item returnable?</FormLabel>
            <RadioGroup row value={formData.isReturnable.toString()} onChange={handleReturnableChange}>
              <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save Item</Button>
      </Stack>
    </Box>
  );
};

export default AddElement;