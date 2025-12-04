import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Checkbox,
  Button,
  Grid,
  IconButton,
  Collapse,
  Stack,
  Divider,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TextField,
  Paper,
  Alert,
} from "@mui/material";
import {
  ExpandMore,
  Edit,
  Close,
  ShoppingCart,
  Circle,
} from "@mui/icons-material";
import {
  handleSubmitPurchaseRequest,
  isTokenExpired,
} from "../../../Service/AdminServices";

const AdminCardDashboard = ({
  tableData,
  setSelectedItem,
  setOpenEditForm,
  setOpenAvailableForm,
}) => {
  const theme = useTheme();
  const [selected, setSelected] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  // Purchase Request States
  const [purchaseMode, setPurchaseMode] = useState(false);
  const [globalProjectName, setGlobalProjectName] = useState("");
  const [globalRemark, setGlobalRemark] = useState("");
  const [itemRequests, setItemRequests] = useState({});

  const handleSelectItem = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [...selected];

    if (selectedIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    setSelected(newSelected);
  };

  const handleSelectAll = () => {
    if (selected.length === tableData.length) {
      setSelected([]);
    } else {
      setSelected(tableData.map((item) => item.id));
    }
  };

  const toggleExpand = (id, event) => {
    event.stopPropagation();
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewDetails = (item, event) => {
    event.stopPropagation();
    setSelectedDetailItem(item);
    setDetailDialogOpen(true);
  };

  const handleEdit = (item, event) => {
    event.stopPropagation();
    setSelectedItem(item);
    setOpenEditForm(true);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const getStockStatus = (item) => {
    const stock = item.stock;
    if (stock <= 0) {
      return {
        label: "Out of Stock",
        color: "#ef5350",
        textColor: "#fff",
      };
    }
    if (stock < 10) {
      return {
        label: "Low Stock",
        color: "#ff9800",
        textColor: "#fff",
      };
    }
    return {
      label: "Available",
      color: "#66bb6a",
      textColor: "#fff",
    };
  };

  const getSubCategoryDisplayName = (subCategory) => {
    return subCategory === "Mechanics" ? "Tools and Instruments" : subCategory;
  };

  const togglePurchaseMode = () => {
    setPurchaseMode(!purchaseMode);
    setSelected([]);
    setItemRequests({});
    setGlobalProjectName("");
    setGlobalRemark("");
  };

  const handleQuantityChange = (itemId, value) => {
    setItemRequests((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity: parseInt(value) || 0,
      },
    }));
  };

  const handleReturnDateChange = (itemId, value) => {
    setItemRequests((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        returnDate: value,
      },
    }));
  };

  const onSubmitPurchaseRequest = async () => {
    const success = await handleSubmitPurchaseRequest(
      selected,
      tableData,
      itemRequests,
      globalProjectName,
      globalRemark
    );

    if (success) {
      togglePurchaseMode();
    }
  };

  if (!tableData || tableData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="text.secondary">No items available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Purchase Mode Controls */}
      <Paper
        elevation={3}
        sx={{
          mb: 3,
          p: 2.5,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 3,
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Inventory Management
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              {purchaseMode && selected.length > 0 && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={onSubmitPurchaseRequest}
                  sx={{ fontWeight: "bold" }}
                >
                  Submit ({selected.length})
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={togglePurchaseMode}
                size="small"
                sx={{
                  bgcolor: purchaseMode ? "error.main" : "white",
                  color: purchaseMode ? "white" : theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: purchaseMode
                      ? "error.dark"
                      : "rgba(255,255,255,0.9)",
                  },
                }}
              >
                {purchaseMode ? "Cancel" : "Purchase"}
              </Button>
            </Stack>
          </Stack>

          {purchaseMode && (
            <Box>
              <Alert severity="info" sx={{ mb: 2, fontSize: "0.85rem" }}>
                Select items and enter quantities below.
              </Alert>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    value={globalProjectName}
                    onChange={(e) => setGlobalProjectName(e.target.value)}
                    required
                    size="small"
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reason / Remark"
                    value={globalRemark}
                    onChange={(e) => setGlobalRemark(e.target.value)}
                    required
                    size="small"
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Select All Button - Only in Purchase Mode */}
      {purchaseMode && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={handleSelectAll}
            size="small"
            startIcon={
              <Checkbox checked={selected.length === tableData.length} />
            }
          >
            {selected.length === tableData.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </Box>
      )}

      {/* Items Grid */}
      <Grid container spacing={2.5}>
        {tableData.map((item) => {
          const isItemSelected = isSelected(item.id);
          const isExpanded = expandedCards[item.id];
          const stockStatus = getStockStatus(item);
          const itemRequest = itemRequests[item.id] || {};

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: isItemSelected
                    ? `3px solid ${theme.palette.success.main}`
                    : "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                  },
                  opacity: purchaseMode && item.stock <= 0 ? 0.6 : 1,
                  borderRadius: 2.5,
                }}
              >
                {/* Selection Checkbox - Only in Purchase Mode */}
                {purchaseMode && item.stock > 0 && (
                  <Box
                    sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
                  >
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleSelectItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        bgcolor: "white",
                        borderRadius: "50%",
                        "&.Mui-checked": {
                          color: theme.palette.success.main,
                        },
                      }}
                    />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  {/* Item Name */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "3.6em",
                      mt: purchaseMode ? 2 : 0,
                    }}
                  >
                    {item.name}
                  </Typography>

                  {/* Value */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mr: 1 }}
                    >
                      Value:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.8em",
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* Stock Status Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.2,
                      bgcolor: stockStatus.color,
                      borderRadius: 1.5,
                      mb: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Circle
                        sx={{ fontSize: 10, color: stockStatus.textColor }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        sx={{
                          color: stockStatus.textColor,
                          fontSize: "0.75rem",
                        }}
                      >
                        {stockStatus.label}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: stockStatus.textColor }}
                    >
                      {item.stock}
                    </Typography>
                  </Box>

                  {/* Purchase Request Fields */}
                  {purchaseMode && isItemSelected && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        borderRadius: 1.5,
                      }}
                    >
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        size="small"
                        value={itemRequest.quantity || ""}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        inputProps={{ min: 1, max: item.stock }}
                        sx={{ mb: item.isReturnable ? 1 : 0 }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {item.isReturnable && (
                        <TextField
                          fullWidth
                          type="date"
                          label="Return Date"
                          size="small"
                          value={itemRequest.returnDate || ""}
                          onChange={(e) =>
                            handleReturnDateChange(item.id, e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </Box>
                  )}

                  {/* Expandable Details - UNIFIED */}
                  <Collapse in={isExpanded}>
                    <Divider sx={{ mb: 1.5 }} />
                    <Stack spacing={0.8}>
                      <DetailRow label="Category" value={item.category} />
                      <DetailRow
                        label="Sub-Category"
                        value={getSubCategoryDisplayName(item.subCategory)}
                      />
                      <DetailRow
                        label="Manufacturer"
                        value={item.manufacturer}
                      />
                      <DetailRow label="Location" value={item.location} />
                      <DetailRow label="Package" value={item.package_box} />
                      <DetailRow label="MPN" value={item.mpn} />
                      <DetailRow label="SAP No" value={item.sap_no} />
                      <DetailRow
                        label="Returnable"
                        value={item.isReturnable ? "Yes" : "No"}
                        chip
                        chipColor={item.isReturnable ? "info" : "default"}
                      />
                    </Stack>
                  </Collapse>
                </CardContent>

                {/* Expand/Collapse Button - UNIFIED ACTION */}
                <Box
                  onClick={(e) => toggleExpand(item.id, e)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    cursor: "pointer",
                    transition: "all 0.3s",
                    borderTop: "1px solid #e0e0e0",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ mr: 0.5 }}>
                    {isExpanded ? "Hide" : "Show"} Details
                  </Typography>
                  <ExpandMore
                    sx={{
                      fontSize: "1.1rem",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </Box>

                {/* Edit Button - SINGLE ACTION */}
                {!purchaseMode && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderTop: "1px solid #e0e0e0",
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<Edit />}
                      onClick={(e) => handleEdit(item, e)}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Full Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: theme.palette.primary.main,
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Item Details
          </Typography>
          <IconButton
            onClick={() => setDetailDialogOpen(false)}
            sx={{ color: "white" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedDetailItem && (
            <Stack spacing={1.5}>
              <DetailRow label="Name" value={selectedDetailItem.name} bold />
              <DetailRow label="Value" value={selectedDetailItem.value} />
              <DetailRow
                label="Description"
                value={selectedDetailItem.description}
              />
              <DetailRow label="Category" value={selectedDetailItem.category} />
              <DetailRow
                label="Sub-Category"
                value={getSubCategoryDisplayName(
                  selectedDetailItem.subCategory
                )}
              />
              <DetailRow
                label="Manufacturer"
                value={selectedDetailItem.manufacturer}
              />
              <DetailRow label="Location" value={selectedDetailItem.location} />
              <DetailRow
                label="Package Box"
                value={selectedDetailItem.package_box}
              />
              <DetailRow label="MPN" value={selectedDetailItem.mpn} />
              <DetailRow label="SAP No" value={selectedDetailItem.sap_no} />
              <DetailRow label="Stock" value={selectedDetailItem.stock} bold />
              <DetailRow
                label="Status"
                value={getStockStatus(selectedDetailItem).label}
                chip
                chipColor={getStockStatus(selectedDetailItem).color}
              />
              <DetailRow
                label="Returnable"
                value={selectedDetailItem.isReturnable ? "Yes" : "No"}
                chip
                chipColor={selectedDetailItem.isReturnable ? "info" : "default"}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleEdit(selectedDetailItem, { stopPropagation: () => {} });
              setDetailDialogOpen(false);
            }}
          >
            Edit Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper component for detail rows
const DetailRow = ({ label, value, bold, chip, chipColor }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: "0.85rem" }}
    >
      {label}:
    </Typography>
    {chip ? (
      <Chip label={value} color={chipColor} size="small" />
    ) : (
      <Typography
        variant="body2"
        fontWeight={bold ? "bold" : "normal"}
        sx={{ fontSize: "0.85rem" }}
      >
        {value || "N/A"}
      </Typography>
    )}
  </Box>
);

export default AdminCardDashboard;

// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Chip,
//   Checkbox,
//   Button,
//   Grid,
//   IconButton,
//   Collapse,
//   Stack,
//   Divider,
//   useTheme,
//   alpha,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
//   TextField,
//   Paper,
//   Alert,
// } from "@mui/material";
// import {
//   ExpandMore,
//   Edit,
//   Close,
//   ShoppingCart,
//   Circle,
// } from "@mui/icons-material";
// import {
//   handleSubmitPurchaseRequest,
//   isTokenExpired,
// } from "../../../Service/AdminServices";

// const AdminCardDashboard = ({
//   tableData,
//   setSelectedItem,
//   setOpenEditForm,
//   setOpenAvailableForm,
// }) => {
//   const theme = useTheme();
//   const [selected, setSelected] = useState([]);
//   const [expandedCards, setExpandedCards] = useState({});
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false);
//   const [selectedDetailItem, setSelectedDetailItem] = useState(null);

//   // Purchase Request States
//   const [purchaseMode, setPurchaseMode] = useState(false);
//   const [globalProjectName, setGlobalProjectName] = useState("");
//   const [globalRemark, setGlobalRemark] = useState("");
//   const [itemRequests, setItemRequests] = useState({});

//   const handleSelectItem = (id) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [...selected];

//     if (selectedIndex === -1) {
//       newSelected.push(id);
//     } else {
//       newSelected.splice(selectedIndex, 1);
//     }
//     setSelected(newSelected);
//   };

//   const handleSelectAll = () => {
//     if (selected.length === tableData.length) {
//       setSelected([]);
//     } else {
//       setSelected(tableData.map((item) => item.id));
//     }
//   };

//   const toggleExpand = (id, event) => {
//     event.stopPropagation();
//     setExpandedCards((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const handleViewDetails = (item, event) => {
//     event.stopPropagation();
//     setSelectedDetailItem(item);
//     setDetailDialogOpen(true);
//   };

//   const handleEdit = (item, event) => {
//     event.stopPropagation();
//     setSelectedItem(item);
//     setOpenEditForm(true);
//   };

//   const isSelected = (id) => selected.indexOf(id) !== -1;

//   const getStockStatus = (item) => {
//     const stock = item.stock;
//     if (stock <= 0) {
//       return {
//         label: "Out of Stock",
//         color: "#ef5350",
//         textColor: "#fff",
//       };
//     }
//     if (stock < 10) {
//       return {
//         label: "Low Stock",
//         color: "#ff9800",
//         textColor: "#fff",
//       };
//     }
//     return {
//       label: "Available",
//       color: "#66bb6a",
//       textColor: "#fff",
//     };
//   };

//   const getSubCategoryDisplayName = (subCategory) => {
//     return subCategory === "Mechanics" ? "Tools and Instruments" : subCategory;
//   };

//   const togglePurchaseMode = () => {
//     setPurchaseMode(!purchaseMode);
//     setSelected([]);
//     setItemRequests({});
//     setGlobalProjectName("");
//     setGlobalRemark("");
//   };

//   const handleQuantityChange = (itemId, value) => {
//     setItemRequests((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         quantity: parseInt(value) || 0,
//       },
//     }));
//   };

//   const handleReturnDateChange = (itemId, value) => {
//     setItemRequests((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         returnDate: value,
//       },
//     }));
//   };

//   const onSubmitPurchaseRequest = async () => {
//     const success = await handleSubmitPurchaseRequest(
//       selected,
//       tableData,
//       itemRequests,
//       globalProjectName,
//       globalRemark
//     );

//     if (success) {
//       togglePurchaseMode();
//     }
//   };

//   if (!tableData || tableData.length === 0) {
//     return (
//       <Box sx={{ textAlign: "center", p: 4 }}>
//         <Typography color="text.secondary">No items available</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Purchase Mode Controls */}
//       <Paper
//         elevation={3}
//         sx={{
//           mb: 3,
//           p: 3,
//           background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//           color: "white",
//           borderRadius: 3,
//         }}
//       >
//         <Stack spacing={2}>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h5" fontWeight="bold">
//               Inventory Management
//             </Typography>
//             <Stack direction="row" alignItems="center" spacing={2}>
//               {purchaseMode && selected.length > 0 && (
//                 <Button
//                   variant="contained"
//                   color="success"
//                   size="large"
//                   onClick={onSubmitPurchaseRequest}
//                   sx={{ fontWeight: "bold" }}
//                 >
//                   Submit Purchase Request ({selected.length} items)
//                 </Button>
//               )}
//               <Button
//                 variant="contained"
//                 startIcon={<ShoppingCart />}
//                 onClick={togglePurchaseMode}
//                 sx={{
//                   bgcolor: purchaseMode ? "error.main" : "white",
//                   color: purchaseMode ? "white" : theme.palette.primary.main,
//                   "&:hover": {
//                     bgcolor: purchaseMode
//                       ? "error.dark"
//                       : "rgba(255,255,255,0.9)",
//                   },
//                 }}
//               >
//                 {purchaseMode ? "Cancel Request" : "Raise Purchase Request"}
//               </Button>
//             </Stack>
//           </Stack>

//           {purchaseMode && (
//             <Box>
//               <Alert severity="info" sx={{ mb: 2 }}>
//                 Select items below and enter quantities. Fill in project details
//                 here.
//               </Alert>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Project Name"
//                     value={globalProjectName}
//                     onChange={(e) => setGlobalProjectName(e.target.value)}
//                     required
//                     sx={{
//                       bgcolor: "white",
//                       borderRadius: 1,
//                       "& .MuiOutlinedInput-root": {
//                         "& fieldset": { borderColor: "white" },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Reason / Remark"
//                     value={globalRemark}
//                     onChange={(e) => setGlobalRemark(e.target.value)}
//                     required
//                     sx={{
//                       bgcolor: "white",
//                       borderRadius: 1,
//                       "& .MuiOutlinedInput-root": {
//                         "& fieldset": { borderColor: "white" },
//                       },
//                     }}
//                   />
//                 </Grid>
//               </Grid>
//             </Box>
//           )}
//         </Stack>
//       </Paper>

//       {/* Select All Button - Only in Purchase Mode */}
//       {purchaseMode && (
//         <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
//           <Button
//             variant="outlined"
//             onClick={handleSelectAll}
//             startIcon={
//               <Checkbox checked={selected.length === tableData.length} />
//             }
//           >
//             {selected.length === tableData.length
//               ? "Deselect All"
//               : "Select All"}
//           </Button>
//         </Box>
//       )}

//       {/* Items Grid */}
//       <Grid container spacing={3}>
//         {tableData.map((item) => {
//           const isItemSelected = isSelected(item.id);
//           const isExpanded = expandedCards[item.id];
//           const stockStatus = getStockStatus(item);
//           const itemRequest = itemRequests[item.id] || {};

//           return (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
//               <Card
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   position: "relative",
//                   border: isItemSelected
//                     ? `3px solid ${theme.palette.success.main}`
//                     : "1px solid #e0e0e0",
//                   transition: "all 0.3s ease",
//                   cursor: "default",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: 6,
//                   },
//                   opacity: purchaseMode && item.stock <= 0 ? 0.6 : 1,
//                 }}
//               >
//                 {/* Selection Checkbox - Only in Purchase Mode */}
//                 {purchaseMode && item.stock > 0 && (
//                   <Box
//                     sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
//                   >
//                     <Checkbox
//                       checked={isItemSelected}
//                       onChange={() => handleSelectItem(item.id)}
//                       onClick={(e) => e.stopPropagation()}
//                       sx={{
//                         bgcolor: "white",
//                         borderRadius: "50%",
//                         "&.Mui-checked": {
//                           color: theme.palette.success.main,
//                         },
//                       }}
//                     />
//                   </Box>
//                 )}

//                 <CardContent sx={{ flexGrow: 1, pt: purchaseMode ? 5 : 2 }}>
//                   {/* Item Name */}
//                   <Typography
//                     variant="h6"
//                     fontWeight="bold"
//                     gutterBottom
//                     sx={{
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                       minHeight: "3.6em",
//                     }}
//                   >
//                     {item.name}
//                   </Typography>

//                   {/* Value */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       mb: 1,
//                       bgcolor: alpha(theme.palette.primary.main, 0.08),
//                       p: 1,
//                       borderRadius: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       sx={{ mr: 1 }}
//                     >
//                       Value:
//                     </Typography>
//                     <Typography variant="body2" fontWeight="bold">
//                       {item.value}
//                     </Typography>
//                   </Box>

//                   {/* Description */}
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{
//                       mb: 2,
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                       minHeight: "2.8em",
//                     }}
//                   >
//                     {item.description}
//                   </Typography>

//                   {/* Stock Status Badge */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       p: 1.5,
//                       bgcolor: stockStatus.color,
//                       borderRadius: 2,
//                       mb: 2,
//                     }}
//                   >
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <Circle
//                         sx={{ fontSize: 12, color: stockStatus.textColor }}
//                       />
//                       <Typography
//                         variant="body2"
//                         fontWeight="bold"
//                         sx={{ color: stockStatus.textColor }}
//                       >
//                         {stockStatus.label}
//                       </Typography>
//                     </Stack>
//                     <Typography
//                       variant="h6"
//                       fontWeight="bold"
//                       sx={{ color: stockStatus.textColor }}
//                     >
//                       {item.stock}
//                     </Typography>
//                   </Box>

//                   {/* Purchase Request Fields */}
//                   {purchaseMode && isItemSelected && (
//                     <Box
//                       sx={{
//                         mb: 2,
//                         p: 2,
//                         bgcolor: alpha(theme.palette.success.main, 0.1),
//                         borderRadius: 2,
//                       }}
//                     >
//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Quantity"
//                         size="small"
//                         value={itemRequest.quantity || ""}
//                         onChange={(e) =>
//                           handleQuantityChange(item.id, e.target.value)
//                         }
//                         inputProps={{ min: 1, max: item.stock }}
//                         sx={{ mb: item.isReturnable ? 1 : 0 }}
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                       {item.isReturnable && (
//                         <TextField
//                           fullWidth
//                           type="date"
//                           label="Return Date"
//                           size="small"
//                           value={itemRequest.returnDate || ""}
//                           onChange={(e) =>
//                             handleReturnDateChange(item.id, e.target.value)
//                           }
//                           InputLabelProps={{ shrink: true }}
//                           inputProps={{
//                             min: new Date().toISOString().split("T")[0],
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       )}
//                     </Box>
//                   )}

//                   {/* Expandable Details */}
//                   <Collapse in={isExpanded}>
//                     <Divider sx={{ mb: 2 }} />
//                     <Stack spacing={1}>
//                       <DetailRow label="Category" value={item.category} />
//                       <DetailRow
//                         label="Sub-Category"
//                         value={getSubCategoryDisplayName(item.subCategory)}
//                       />
//                       <DetailRow
//                         label="Manufacturer"
//                         value={item.manufacturer}
//                       />
//                       <DetailRow label="Location" value={item.location} />
//                       <DetailRow label="Package" value={item.package_box} />
//                       <DetailRow label="MPN" value={item.mpn} />
//                       <DetailRow label="SAP No" value={item.sap_no} />
//                       <DetailRow
//                         label="Returnable"
//                         value={item.isReturnable ? "Yes" : "No"}
//                         chip
//                         chipColor={item.isReturnable ? "info" : "default"}
//                       />
//                     </Stack>
//                   </Collapse>

//                   {/* Action Buttons - Hidden in Purchase Mode */}
//                   {!purchaseMode && (
//                     <Box onClick={(e) => e.stopPropagation()} sx={{ mt: 2 }}>
//                       <Stack direction="row" spacing={1}>
//                         <Tooltip title="View Full Details">
//                           <Button
//                             size="small"
//                             variant="outlined"
//                             onClick={(e) => handleViewDetails(item, e)}
//                             fullWidth
//                           >
//                             Details
//                           </Button>
//                         </Tooltip>
//                         <Tooltip title="Edit Item">
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={(e) => handleEdit(item, e)}
//                             sx={{
//                               border: `1px solid ${theme.palette.primary.main}`,
//                               borderRadius: 1,
//                             }}
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     </Box>
//                   )}
//                 </CardContent>

//                 {/* Expand/Collapse Button */}
//                 <Box
//                   onClick={(e) => toggleExpand(item.id, e)}
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     p: 1,
//                     bgcolor: alpha(theme.palette.primary.main, 0.08),
//                     cursor: "pointer",
//                     transition: "all 0.3s",
//                     "&:hover": {
//                       bgcolor: alpha(theme.palette.primary.main, 0.15),
//                     },
//                   }}
//                 >
//                   <Typography variant="caption" sx={{ mr: 1 }}>
//                     {isExpanded ? "Less" : "More"} Details
//                   </Typography>
//                   <ExpandMore
//                     sx={{
//                       transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
//                       transition: "transform 0.3s",
//                     }}
//                   />
//                 </Box>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>

//       {/* Full Details Dialog */}
//       <Dialog
//         open={detailDialogOpen}
//         onClose={() => setDetailDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             bgcolor: theme.palette.primary.main,
//             color: "white",
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold">
//             Item Details
//           </Typography>
//           <IconButton
//             onClick={() => setDetailDialogOpen(false)}
//             sx={{ color: "white" }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ mt: 2 }}>
//           {selectedDetailItem && (
//             <Stack spacing={2}>
//               <DetailRow label="Name" value={selectedDetailItem.name} bold />
//               <DetailRow label="Value" value={selectedDetailItem.value} />
//               <DetailRow
//                 label="Description"
//                 value={selectedDetailItem.description}
//               />
//               <DetailRow label="Category" value={selectedDetailItem.category} />
//               <DetailRow
//                 label="Sub-Category"
//                 value={getSubCategoryDisplayName(
//                   selectedDetailItem.subCategory
//                 )}
//               />
//               <DetailRow
//                 label="Manufacturer"
//                 value={selectedDetailItem.manufacturer}
//               />
//               <DetailRow label="Location" value={selectedDetailItem.location} />
//               <DetailRow
//                 label="Package Box"
//                 value={selectedDetailItem.package_box}
//               />
//               <DetailRow label="MPN" value={selectedDetailItem.mpn} />
//               <DetailRow label="SAP No" value={selectedDetailItem.sap_no} />
//               <DetailRow label="Stock" value={selectedDetailItem.stock} bold />
//               <DetailRow
//                 label="Status"
//                 value={getStockStatus(selectedDetailItem).label}
//                 chip
//                 chipColor={getStockStatus(selectedDetailItem).color}
//               />
//               <DetailRow
//                 label="Returnable"
//                 value={selectedDetailItem.isReturnable ? "Yes" : "No"}
//                 chip
//                 chipColor={selectedDetailItem.isReturnable ? "info" : "default"}
//               />
//             </Stack>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
//           <Button
//             variant="contained"
//             onClick={() => {
//               handleEdit(selectedDetailItem, { stopPropagation: () => {} });
//               setDetailDialogOpen(false);
//             }}
//           >
//             Edit Item
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// // Helper component for detail rows
// const DetailRow = ({ label, value, bold, chip, chipColor }) => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Typography variant="body2" color="text.secondary">
//       {label}:
//     </Typography>
//     {chip ? (
//       <Chip label={value} color={chipColor} size="small" />
//     ) : (
//       <Typography variant="body2" fontWeight={bold ? "bold" : "normal"}>
//         {value || "N/A"}
//       </Typography>
//     )}
//   </Box>
// );

// export default AdminCardDashboard;

// // import React, { useState } from "react";
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Typography,
// //   Chip,
// //   Checkbox,
// //   Button,
// //   Grid,
// //   IconButton,
// //   Collapse,
// //   Stack,
// //   Divider,
// //   useTheme,
// //   alpha,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Tooltip,
// // } from "@mui/material";
// // import {
// //   ExpandMore,
// //   Edit,
// //   CheckCircle,
// //   Warning,
// //   Error as ErrorIcon,
// //   Close,
// // } from "@mui/icons-material";

// // const AdminCardDashboard = ({
// //   tableData,
// //   setSelectedItem,
// //   setOpenEditForm,
// //   setOpenAvailableForm,
// // }) => {
// //   const theme = useTheme();
// //   const [selected, setSelected] = useState([]);
// //   const [expandedCards, setExpandedCards] = useState({});
// //   const [detailDialogOpen, setDetailDialogOpen] = useState(false);
// //   const [selectedDetailItem, setSelectedDetailItem] = useState(null);

// //   const handleSelectItem = (id) => {
// //     const selectedIndex = selected.indexOf(id);
// //     let newSelected = [...selected];

// //     if (selectedIndex === -1) {
// //       newSelected.push(id);
// //     } else {
// //       newSelected.splice(selectedIndex, 1);
// //     }
// //     setSelected(newSelected);
// //   };

// //   const handleSelectAll = () => {
// //     if (selected.length === tableData.length) {
// //       setSelected([]);
// //     } else {
// //       setSelected(tableData.map((item) => item.id));
// //     }
// //   };

// //   const toggleExpand = (id, event) => {
// //     event.stopPropagation();
// //     setExpandedCards((prev) => ({
// //       ...prev,
// //       [id]: !prev[id],
// //     }));
// //   };

// //   const handleViewDetails = (item, event) => {
// //     event.stopPropagation();
// //     setSelectedDetailItem(item);
// //     setDetailDialogOpen(true);
// //   };

// //   const handleEdit = (item, event) => {
// //     event.stopPropagation();
// //     setSelectedItem(item);
// //     setOpenEditForm(true);
// //   };

// //   const handleIssue = (item, event) => {
// //     event.stopPropagation();
// //     setSelectedItem(item);
// //     setOpenAvailableForm(true);
// //   };

// //   const isSelected = (id) => selected.indexOf(id) !== -1;

// //   const getStockStatus = (item) => {
// //     const stock = item.stock;
// //     if (stock <= 0) {
// //       return {
// //         label: "Out of Stock",
// //         color: "error",
// //         icon: <ErrorIcon fontSize="small" />,
// //         bgColor: theme.palette.error.light,
// //       };
// //     }
// //     if (stock < 10) {
// //       return {
// //         label: "Low Stock",
// //         color: "warning",
// //         icon: <Warning fontSize="small" />,
// //         bgColor: theme.palette.warning.light,
// //       };
// //     }
// //     return {
// //       label: "Available",
// //       color: "success",
// //       icon: <CheckCircle fontSize="small" />,
// //       bgColor: theme.palette.success.light,
// //     };
// //   };

// //   const getSubCategoryDisplayName = (subCategory) => {
// //     return subCategory === "Mechanics" ? "Tools and Instruments" : subCategory;
// //   };

// //   if (!tableData || tableData.length === 0) {
// //     return (
// //       <Box sx={{ textAlign: "center", p: 4 }}>
// //         <Typography color="text.secondary">No items available</Typography>
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box>
// //       {/* Bulk Actions Bar */}
// //       {selected.length > 0 && (
// //         <Card
// //           sx={{
// //             mb: 3,
// //             background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
// //             color: "white",
// //           }}
// //         >
// //           <CardContent>
// //             <Stack
// //               direction="row"
// //               justifyContent="space-between"
// //               alignItems="center"
// //             >
// //               <Typography variant="h6" fontWeight="bold">
// //                 {selected.length} Item{selected.length !== 1 ? "s" : ""}{" "}
// //                 Selected
// //               </Typography>
// //               <Button
// //                 variant="contained"
// //                 onClick={() => setSelected([])}
// //                 sx={{
// //                   bgcolor: "white",
// //                   color: theme.palette.secondary.main,
// //                   "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
// //                 }}
// //               >
// //                 Clear Selection
// //               </Button>
// //             </Stack>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {/* Select All Button */}
// //       <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
// //         <Button
// //           variant="outlined"
// //           onClick={handleSelectAll}
// //           startIcon={
// //             <Checkbox checked={selected.length === tableData.length} />
// //           }
// //         >
// //           {selected.length === tableData.length ? "Deselect All" : "Select All"}
// //         </Button>
// //       </Box>

// //       {/* Items Grid */}
// //       <Grid container spacing={3}>
// //         {tableData.map((item) => {
// //           const isItemSelected = isSelected(item.id);
// //           const isExpanded = expandedCards[item.id];
// //           const stockStatus = getStockStatus(item);

// //           return (
// //             <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
// //               <Card
// //                 sx={{
// //                   height: "100%",
// //                   display: "flex",
// //                   flexDirection: "column",
// //                   position: "relative",
// //                   border: isItemSelected
// //                     ? `3px solid ${theme.palette.primary.main}`
// //                     : "1px solid #e0e0e0",
// //                   transition: "all 0.3s ease",
// //                   cursor: "pointer",
// //                   "&:hover": {
// //                     transform: "translateY(-4px)",
// //                     boxShadow: 6,
// //                   },
// //                 }}
// //                 onClick={() => handleSelectItem(item.id)}
// //               >
// //                 {/* Selection Checkbox */}
// //                 <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
// //                   <Checkbox
// //                     checked={isItemSelected}
// //                     sx={{
// //                       bgcolor: "white",
// //                       borderRadius: "50%",
// //                       "&.Mui-checked": {
// //                         color: theme.palette.primary.main,
// //                       },
// //                     }}
// //                   />
// //                 </Box>

// //                 <CardContent sx={{ flexGrow: 1, pt: 5 }}>
// //                   {/* Item Name */}
// //                   <Typography
// //                     variant="h6"
// //                     fontWeight="bold"
// //                     gutterBottom
// //                     sx={{
// //                       display: "-webkit-box",
// //                       WebkitLineClamp: 2,
// //                       WebkitBoxOrient: "vertical",
// //                       overflow: "hidden",
// //                       minHeight: "3.6em",
// //                     }}
// //                   >
// //                     {item.name}
// //                   </Typography>

// //                   {/* Value */}
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       mb: 1,
// //                       bgcolor: alpha(theme.palette.primary.main, 0.08),
// //                       p: 1,
// //                       borderRadius: 1,
// //                     }}
// //                   >
// //                     <Typography
// //                       variant="caption"
// //                       color="text.secondary"
// //                       sx={{ mr: 1 }}
// //                     >
// //                       Value:
// //                     </Typography>
// //                     <Typography variant="body2" fontWeight="bold">
// //                       {item.value}
// //                     </Typography>
// //                   </Box>

// //                   {/* Specification */}
// //                   <Typography
// //                     variant="body2"
// //                     color="text.secondary"
// //                     sx={{
// //                       mb: 2,
// //                       display: "-webkit-box",
// //                       WebkitLineClamp: 2,
// //                       WebkitBoxOrient: "vertical",
// //                       overflow: "hidden",
// //                       minHeight: "2.8em",
// //                     }}
// //                   >
// //                     {item.description}
// //                   </Typography>

// //                   {/* Stock Display */}
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       justifyContent: "space-between",
// //                       p: 1.5,
// //                       bgcolor: alpha(stockStatus.bgColor, 0.2),
// //                       borderRadius: 2,
// //                       mb: 2,
// //                       border: `1px solid ${alpha(stockStatus.bgColor, 0.5)}`,
// //                     }}
// //                   >
// //                     <Stack direction="row" alignItems="center" spacing={0.5}>
// //                       {stockStatus.icon}
// //                       <Typography variant="caption" fontWeight="bold">
// //                         Stock
// //                       </Typography>
// //                     </Stack>
// //                     <Typography
// //                       variant="h6"
// //                       fontWeight="bold"
// //                       color={stockStatus.color}
// //                     >
// //                       {item.stock}
// //                     </Typography>
// //                   </Box>

// //                   {/* Status Chip */}
// //                   <Chip
// //                     icon={stockStatus.icon}
// //                     label={stockStatus.label}
// //                     color={stockStatus.color}
// //                     size="small"
// //                     sx={{ mb: 2, width: "100%" }}
// //                   />

// //                   {/* Expandable Details */}
// //                   <Collapse in={isExpanded}>
// //                     <Divider sx={{ mb: 2 }} />
// //                     <Stack spacing={1}>
// //                       <DetailRow label="Category" value={item.category} />
// //                       <DetailRow
// //                         label="Sub-Category"
// //                         value={getSubCategoryDisplayName(item.subCategory)}
// //                       />
// //                       <DetailRow
// //                         label="Manufacturer"
// //                         value={item.manufacturer}
// //                       />
// //                       <DetailRow label="Location" value={item.location} />
// //                       <DetailRow label="Package" value={item.package_box} />
// //                       <DetailRow label="MPN" value={item.mpn} />
// //                       <DetailRow label="SAP No" value={item.sap_no} />
// //                       <DetailRow
// //                         label="Returnable"
// //                         value={item.isReturnable ? "Yes" : "No"}
// //                         chip
// //                         chipColor={item.isReturnable ? "info" : "default"}
// //                       />
// //                     </Stack>
// //                   </Collapse>

// //                   {/* Action Buttons */}
// //                   <Box onClick={(e) => e.stopPropagation()} sx={{ mt: 2 }}>
// //                     <Stack direction="row" spacing={1}>
// //                       <Tooltip title="View Full Details">
// //                         <Button
// //                           size="small"
// //                           variant="outlined"
// //                           onClick={(e) => handleViewDetails(item, e)}
// //                           fullWidth
// //                         >
// //                           Details
// //                         </Button>
// //                       </Tooltip>
// //                       <Tooltip title="Edit Item">
// //                         <IconButton
// //                           size="small"
// //                           color="primary"
// //                           onClick={(e) => handleEdit(item, e)}
// //                           sx={{
// //                             border: `1px solid ${theme.palette.primary.main}`,
// //                             borderRadius: 1,
// //                           }}
// //                         >
// //                           <Edit fontSize="small" />
// //                         </IconButton>
// //                       </Tooltip>
// //                     </Stack>
// //                     {item.stock > 0 && (
// //                       <Button
// //                         size="small"
// //                         variant="contained"
// //                         color="success"
// //                         onClick={(e) => handleIssue(item, e)}
// //                         fullWidth
// //                         sx={{ mt: 1 }}
// //                       >
// //                         Issue Item
// //                       </Button>
// //                     )}
// //                   </Box>
// //                 </CardContent>

// //                 {/* Expand/Collapse Button */}
// //                 <Box
// //                   onClick={(e) => toggleExpand(item.id, e)}
// //                   sx={{
// //                     display: "flex",
// //                     justifyContent: "center",
// //                     alignItems: "center",
// //                     p: 1,
// //                     bgcolor: alpha(theme.palette.primary.main, 0.08),
// //                     cursor: "pointer",
// //                     transition: "all 0.3s",
// //                     "&:hover": {
// //                       bgcolor: alpha(theme.palette.primary.main, 0.15),
// //                     },
// //                   }}
// //                 >
// //                   <Typography variant="caption" sx={{ mr: 1 }}>
// //                     {isExpanded ? "Less" : "More"} Details
// //                   </Typography>
// //                   <ExpandMore
// //                     sx={{
// //                       transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
// //                       transition: "transform 0.3s",
// //                     }}
// //                   />
// //                 </Box>
// //               </Card>
// //             </Grid>
// //           );
// //         })}
// //       </Grid>

// //       {/* Full Details Dialog */}
// //       <Dialog
// //         open={detailDialogOpen}
// //         onClose={() => setDetailDialogOpen(false)}
// //         maxWidth="sm"
// //         fullWidth
// //       >
// //         <DialogTitle
// //           sx={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             bgcolor: theme.palette.primary.main,
// //             color: "white",
// //           }}
// //         >
// //           <Typography variant="h6" fontWeight="bold">
// //             Item Details
// //           </Typography>
// //           <IconButton
// //             onClick={() => setDetailDialogOpen(false)}
// //             sx={{ color: "white" }}
// //           >
// //             <Close />
// //           </IconButton>
// //         </DialogTitle>
// //         <DialogContent sx={{ mt: 2 }}>
// //           {selectedDetailItem && (
// //             <Stack spacing={2}>
// //               <DetailRow label="Name" value={selectedDetailItem.name} bold />
// //               <DetailRow label="Value" value={selectedDetailItem.value} />
// //               <DetailRow
// //                 label="Description"
// //                 value={selectedDetailItem.description}
// //               />
// //               <DetailRow label="Category" value={selectedDetailItem.category} />
// //               <DetailRow
// //                 label="Sub-Category"
// //                 value={getSubCategoryDisplayName(
// //                   selectedDetailItem.subCategory
// //                 )}
// //               />
// //               <DetailRow
// //                 label="Manufacturer"
// //                 value={selectedDetailItem.manufacturer}
// //               />
// //               <DetailRow label="Location" value={selectedDetailItem.location} />
// //               <DetailRow
// //                 label="Package Box"
// //                 value={selectedDetailItem.package_box}
// //               />
// //               <DetailRow label="MPN" value={selectedDetailItem.mpn} />
// //               <DetailRow label="SAP No" value={selectedDetailItem.sap_no} />
// //               <DetailRow label="Stock" value={selectedDetailItem.stock} bold />
// //               <DetailRow
// //                 label="Status"
// //                 value={getStockStatus(selectedDetailItem).label}
// //                 chip
// //                 chipColor={getStockStatus(selectedDetailItem).color}
// //               />
// //               <DetailRow
// //                 label="Returnable"
// //                 value={selectedDetailItem.isReturnable ? "Yes" : "No"}
// //                 chip
// //                 chipColor={selectedDetailItem.isReturnable ? "info" : "default"}
// //               />
// //             </Stack>
// //           )}
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
// //           <Button
// //             variant="contained"
// //             onClick={() => {
// //               handleEdit(selectedDetailItem, { stopPropagation: () => {} });
// //               setDetailDialogOpen(false);
// //             }}
// //           >
// //             Edit Item
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // // Helper component for detail rows
// // const DetailRow = ({ label, value, bold, chip, chipColor }) => (
// //   <Box
// //     sx={{
// //       display: "flex",
// //       justifyContent: "space-between",
// //       alignItems: "center",
// //     }}
// //   >
// //     <Typography variant="body2" color="text.secondary">
// //       {label}:
// //     </Typography>
// //     {chip ? (
// //       <Chip label={value} color={chipColor} size="small" />
// //     ) : (
// //       <Typography variant="body2" fontWeight={bold ? "bold" : "normal"}>
// //         {value || "N/A"}
// //       </Typography>
// //     )}
// //   </Box>
// // );

// // export default AdminCardDashboard;
