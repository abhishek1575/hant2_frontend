export const headers = [
  // "Sr. No.",
  "Component Name",
  "Value",
  "Specification",
  "Sub Category",
  "MFG/Supplier",
  "Location",
  "Package",
  "MPN",
  "SAP_No",
  "Stock",
  "Status",
  "Edit",
];

export const userTableHeaders = [
  "Sr. No.",
  "Component Name",
  "Value",
  "Specification",
  "Sub Category",
  "MFG/Supplier",
  "Location",
  "Package",
  "MPN",
  "SAP_No",
  "Stock",
  "Status",

];

// Function to get display name for subCategory
export const getSubCategoryDisplayName = (subCategory) => {
  return subCategory === "Mechanics" ? "Tools and Instruments" : subCategory;
};

// Function to determine button color
export const getStockColor = (row) => {
  if (row.category === "Asset" && row.subCategory === "Mechanics") {
    return row.stock < 0 ? "error" : "success";
  }
  if (
    (row.category === "Component" && row.subCategory === "Electronics") ||
    (row.category === "Component" && row.subCategory === "Mechanics") ||
    (row.category === "Asset" && row.subCategory === "Electronics")
  ) {
    return row.stock <= 0 ? "error" : row.stock < 10 ? "warning" : "success";
  }
  return row.stock <= 0 ? "error" : row.stock < 10 ? "warning" : "success";
};

// Function to get stock status text
export const getStockStatusText = (row) => {
  if (row.category === "Asset" && row.subCategory === "Mechanics") {
    return row.stock < 0 ? "Unavailable" : "Available";
  }
  return row.stock <= 0
    ? "Unavailable"
    : row.stock < 10
    ? "Low Stock"
    : "Available";
};

// Function to handle status button click
export const handleStatusClick = (
  row,
  setSelectedItem,
  setOpenAvailableForm
) => {
  if (
    (row.category === "Component" && row.subCategory === "Electronics") ||
    (row.category === "Component" && row.subCategory === "Mechanics") ||
    (row.category === "Asset" && row.subCategory === "Electronics") ||
    (row.category === "Asset" && row.subCategory === "Mechanics")
  ) {
    if (row.stock > 0) {
      setSelectedItem(row);
      setOpenAvailableForm(true);
    }
  }
};
