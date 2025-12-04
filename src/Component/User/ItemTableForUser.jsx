import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableContainer,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Chip,
  Checkbox,
  TextField,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import { getSubCategoryDisplayName } from "../../Components/utils/TableHealper";
import { multipleItemsSubmit } from "../../Service/DashboardService";

const ItemTableForUser = ({ tableData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [returnDates, setReturnDates] = useState({});
  const [teamName, setTeamName] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tableData.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleQuantityChange = (id, value) => {
    const newQuantities = { ...quantities, [id]: value };
    setQuantities(newQuantities);
  };

  const handleReturnDateChange = (id, value) => {
    const newReturnDates = { ...returnDates, [id]: value };
    setReturnDates(newReturnDates);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSubmit = async () => {
    console.log("[DEBUG] handleSubmit function started.");
    setError("");

    console.log("[DEBUG] Current state:", {
      selected,
      teamName,
      remark,
      quantities,
      returnDates,
    });

    // Validation
    if (selected.length === 0) {
      console.error("[DEBUG] Validation failed: No items selected.");
      setError("Please select at least one item.");
      return;
    }
    if (!teamName.trim()) {
      console.error("[DEBUG] Validation failed: Team Name is required.");
      setError("Team Name is required.");
      return;
    }
    if (!remark.trim()) {
      console.error("[DEBUG] Validation failed: Reason (Remark) is required.");
      setError("Reason (Remark) is required.");
      return;
    }

    console.log("[DEBUG] Validation passed. Preparing payload...");

    try {
      const requests = selected.map((id) => {
        const item = tableData.find((item) => item.id === id);
        const quantity = parseInt(quantities[id], 10) || 1;

        // Validate quantity
        if (quantity > item.stock) {
          throw new Error(
            `Quantity for '${item.name}' (${quantity}) exceeds available stock (${item.stock}).`
          );
        }
        if (quantity < 1) {
          throw new Error(`Quantity for '${item.name}' must be at least 1.`);
        }

        // Validate return date for returnable items
        if (item.isReturnable && !returnDates[id]) {
          throw new Error(
            `Return date is required for returnable item '${item.name}'.`
          );
        }

        return {
          id: id,
          quantity: quantity,
          returnDate: item.isReturnable ? returnDates[id] : null,
        };
      });

      const payload = {
        requests,
        projectName: teamName.trim(), // Backend expects projectName field
        remark: remark.trim(),
      };

      console.log("[DEBUG] Payload created:", JSON.stringify(payload, null, 2));

      console.log("[DEBUG] Calling multipleItemsSubmit service...");
      await multipleItemsSubmit(payload);
      console.log("[DEBUG] multipleItemsSubmit service call finished.");

      alert("Requests submitted successfully!");

      // Clear the form
      setSelected([]);
      setQuantities({});
      setReturnDates({});
      setTeamName("");
      setRemark("");
    } catch (error) {
      console.error(
        "[DEBUG] An error occurred in the handleSubmit function:",
        error
      );
      setError(error.message || "An error occurred during submission.");
    }
  };

  if (!tableData || tableData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="text.secondary">
          No items match the current filters.
        </Typography>
      </Box>
    );
  }

  const renderDesktopTable = () => (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: "calc(100vh - 420px)", overflow: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": {
                backgroundColor: theme.palette.grey[200],
                fontWeight: "bold",
              },
            }}
          >
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selected.length > 0 && selected.length < tableData.length
                }
                checked={
                  tableData.length > 0 && selected.length === tableData.length
                }
                onChange={handleSelectAllClick}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Returnable</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Return Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => {
            const isItemSelected = isSelected(row.id);
            return (
              <TableRow
                key={row.id}
                hover
                onClick={() => handleRowClick(row.id)}
                role="checkbox"
                tabIndex={-1}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={isItemSelected} />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.description}</TableCell>
                {/* <TableCell>
                  <Chip
                    label={getSubCategoryDisplayName(row.subCategory)}
                    size="small"
                  />
                </TableCell> */}
                {/* <TableCell>{row.manufacturer}</TableCell>
                <TableCell>{row.location}</TableCell> */}
                {/* <TableCell>{row.package_box}</TableCell> */}
                {/* <TableCell>{row.mpn}</TableCell> */}
                {/* <TableCell>{row.sap_no}</TableCell> */}
                <TableCell sx={{ fontWeight: "bold" }}>{row.stock}</TableCell>
                <TableCell>
                  {row.isReturnable ? (
                    <Chip label="Yes" color="success" size="small" />
                  ) : (
                    <Chip label="No" color="default" size="small" />
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {isItemSelected && (
                    <TextField
                      type="number"
                      size="small"
                      variant="outlined"
                      defaultValue={1}
                      sx={{ width: "80px" }}
                      inputProps={{ min: 1, max: row.stock }}
                      onChange={(e) =>
                        handleQuantityChange(row.id, e.target.value)
                      }
                    />
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {isItemSelected && row.isReturnable && (
                    <TextField
                      type="datetime-local"
                      size="small"
                      variant="outlined"
                      sx={{ width: "200px" }}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) =>
                        handleReturnDateChange(row.id, e.target.value)
                      }
                      required
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 2 }}>
      {isMobile ? (
        <Alert severity="info">
          Bulk request is not available on mobile. Please use a desktop device.
        </Alert>
      ) : (
        renderDesktopTable()
      )}
      {selected.length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Team Name"
                variant="outlined"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                error={!teamName && error !== ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reason (Remark)"
                variant="outlined"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
                error={!remark && error !== ""}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit Request ({selected.length}{" "}
                {selected.length === 1 ? "item" : "items"})
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ItemTableForUser;

// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   TableContainer,
//   useTheme,
//   useMediaQuery,
//   Box,
//   Typography,
//   Chip,

//   Checkbox,
//   TextField,
//   Paper,
//   Grid,
//   Alert
// } from "@mui/material";
// import {
//   getSubCategoryDisplayName,
// } from "../../Components/utils/TableHealper";
// import { multipleItemsSubmit } from "../../Service/DashboardService";

// const ItemTableForUser = ({ tableData }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [selected, setSelected] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [projectName, setProjectName] = useState("");
//   const [remark, setRemark] = useState("");
//   const [error, setError] = useState("");

//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelecteds = tableData.map((n) => n.id);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleRowClick = (id) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }
//     setSelected(newSelected);
//   };

//   const handleQuantityChange = (id, value) => {
//     const newQuantities = { ...quantities, [id]: value };
//     setQuantities(newQuantities);
//   };

//   const isSelected = (id) => selected.indexOf(id) !== -1;

//   // const handleSubmit = async () => {
//   //   console.log("[DEBUG] handleSubmit function started.");
//   //   setError("");

//   //   console.log("[DEBUG] Current state:", { selected, projectName, remark, quantities });

//   //   if (selected.length === 0) {
//   //     console.error("[DEBUG] Validation failed: No items selected.");
//   //     setError("Please select at least one item.");
//   //     return;
//   //   }
//   //   if (!projectName.trim()) {
//   //     console.error("[DEBUG] Validation failed: Project Name is required.");
//   //     setError("Project Name is required.");
//   //     return;
//   //   }

//   //   console.log("[DEBUG] Validation passed. Preparing payload...");

//   //   try {
//   //     const requests = selected.map(id => {
//   //       const item = tableData.find(item => item.id === id);
//   //       const quantity = parseInt(quantities[id], 10) || 1;
//   //       if (quantity > item.stock) {
//   //         throw new Error(`Quantity for item '${item.name}' (${quantity}) exceeds available stock (${item.stock}).`);
//   //       }
//   //       return { id, quantity };
//   //     });

//   //     const payload = { requests, projectName, remark };
//   //     console.log("[DEBUG] Payload created:", payload);

//   //     console.log("[DEBUG] Calling multipleItemsSubmit service...");
//   //     await multipleItemsSubmit(payload);
//   //     console.log("[DEBUG] multipleItemsSubmit service call finished.");

//   //     alert("Requests submitted successfully! hi");
//   //     // Clear the form/session
//   //     setSelected([]);
//   //     setQuantities({});
//   //     setProjectName("");
//   //     setRemark("");
//   //     console.log("payload", payload);
//   //   } catch (error) {
//   //     console.error("[DEBUG] An error occurred in the handleSubmit function:", error);
//   //     setError(error.message || "An error occurred during submission.");
//   //   }
//   // };

//   const handleSubmit = async () => {
//     console.log("[DEBUG] handleSubmit function started.");
//     setError("");

//     console.log("[DEBUG] Current state:", {
//       selected,
//       projectName,
//       remark,
//       quantities,
//     });

//     // Validation
//     if (selected.length === 0) {
//       console.error("[DEBUG] Validation failed: No items selected.");
//       setError("Please select at least one item.");
//       return;
//     }
//     if (!projectName.trim()) {
//       console.error("[DEBUG] Validation failed: Project Name is required.");
//       setError("Project Name is required.");
//       return;
//     }

//     console.log("[DEBUG] Validation passed. Preparing payload...");

//     try {
//       // Prepare requests array
//       const requests = selected.map((id) => {
//         const item = tableData.find((item) => item.id === id);
//         const quantity = parseInt(quantities[id], 10) || 1;

//         // Validate quantity
//         if (quantity > item.stock) {
//           throw new Error(
//             `Quantity for item '${item.name}' (${quantity}) exceeds available stock (${item.stock}).`
//           );
//         }

//         if (quantity < 1) {
//           throw new Error(
//             `Quantity for item '${item.name}' must be at least 1.`
//           );
//         }

//         return {
//           id: id, // Ensure id is passed correctly
//           quantity: quantity,
//         };
//       });

//       const payload = {
//         requests,
//         projectName: projectName.trim(),
//         remark: remark.trim() || "", // Ensure remark is never undefined
//       };

//       console.log("[DEBUG] Payload created:", JSON.stringify(payload, null, 2));

//       console.log("[DEBUG] Calling multipleItemsSubmit service...");
//       const result = await multipleItemsSubmit(payload);
//       console.log("[DEBUG] multipleItemsSubmit service returned:", result);

//       alert("Requests submitted successfully!");

//       // Clear the form
//       setSelected([]);
//       setQuantities({});
//       setProjectName("");
//       setRemark("");

//       console.log("[DEBUG] Form cleared successfully");
//     } catch (error) {
//       console.error("[DEBUG] An error occurred in handleSubmit:", error);
//       setError(
//         error.message ||
//           "An error occurred during submission. Please try again."
//       );
//     }
//   };

//   if (!tableData || tableData.length === 0) {
//     return (
//       <Box sx={{ textAlign: 'center', p: 4 }}>
//         <Typography color="text.secondary">No items match the current filters.</Typography>
//       </Box>
//     );
//   }

//   const renderDesktopTable = () => (
//     <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 420px)', overflow: "auto" }}>
//       <Table stickyHeader>
//         <TableHead>
//           <TableRow sx={{ "& .MuiTableCell-head": { backgroundColor: theme.palette.grey[200], fontWeight: "bold" } }}>
//             <TableCell padding="checkbox">
//               <Checkbox
//                 indeterminate={selected.length > 0 && selected.length < tableData.length}
//                 checked={tableData.length > 0 && selected.length === tableData.length}
//                 onChange={handleSelectAllClick}
//               />
//             </TableCell>
//             <TableCell>Name</TableCell>
//             <TableCell>Value</TableCell>
//             <TableCell>Description</TableCell>
//             <TableCell>Sub-Category</TableCell>
//             <TableCell>Manufacturer</TableCell>
//             <TableCell>Location</TableCell>
//             <TableCell>Package Box</TableCell>
//             <TableCell>MPN</TableCell>
//             <TableCell>SAP NO</TableCell>
//             <TableCell>Stock</TableCell>
//             <TableCell>Quantity</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tableData.map((row) => {
//             const isItemSelected = isSelected(row.id);
//             return (
//               <TableRow key={row.id} hover onClick={() => handleRowClick(row.id)} role="checkbox" tabIndex={-1} selected={isItemSelected}>
//                 <TableCell padding="checkbox">
//                   <Checkbox checked={isItemSelected} />
//                 </TableCell>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.value}</TableCell>
//                 <TableCell>{row.description}</TableCell>
//                 <TableCell>
//                   <Chip label={getSubCategoryDisplayName(row.subCategory)} size="small" />
//                 </TableCell>
//                 <TableCell>{row.manufacturer}</TableCell>
//                 <TableCell>{row.location}</TableCell>
//                 <TableCell>{row.package_box}</TableCell>
//                 <TableCell>{row.mpn}</TableCell>
//                 <TableCell>{row.sap_no}</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>{row.stock}</TableCell>
//                 <TableCell>
//                   {isItemSelected && (
//                     <TextField
//                       type="number"
//                       size="small"
//                       variant="outlined"
//                       defaultValue={1}
//                       sx={{ width: '80px' }}
//                       inputProps={{ min: 1, max: row.stock }}
//                       onClick={(e) => e.stopPropagation()} // Prevent row click from firing
//                       onChange={(e) => handleQuantityChange(row.id, e.target.value)}
//                     />
//                   )}
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );

//   return (
//     <Box sx={{ p: 2 }}>
//       {isMobile ? <Alert severity="info">Bulk request is not available on mobile. Please use a desktop device.</Alert> : renderDesktopTable()}
//       {selected.length > 0 && (
//         <Paper sx={{ p: 2, mt: 2 }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Project Name"
//                 variant="outlined"
//                 value={projectName}
//                 onChange={(e) => setProjectName(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Reason (Remark)"
//                 variant="outlined"
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//               />
//             </Grid>
//             {error && (
//               <Grid item xs={12}>
//                 <Alert severity="error">{error}</Alert>
//               </Grid>
//             )}
//             <Grid item xs={12} sx={{ textAlign: 'right' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmit}
//               >
//                 Submit Request
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default ItemTableForUser;
