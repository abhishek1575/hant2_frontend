import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Checkbox,
  TextField,
  Button,
  Grid,
  Alert,
  IconButton,
  Collapse,
  Stack,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Inventory2Outlined,
  CheckCircleOutline,
  WarningAmber,
  ErrorOutline,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { multipleItemsSubmit } from "../../Service/DashboardService";

const ItemCardDashboard = ({ tableData }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [returnDates, setReturnDates] = useState({});
  const [teamName, setTeamName] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  const handleReturnDateChange = (id, value) => {
    setReturnDates({ ...returnDates, [id]: value });
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const getStockStatus = (stock) => {
    if (stock <= 0)
      return { label: "Out of Stock", color: "error", icon: <ErrorOutline /> };
    if (stock < 10)
      return { label: "Low Stock", color: "warning", icon: <WarningAmber /> };
    return {
      label: "Available",
      color: "success",
      icon: <CheckCircleOutline />,
    };
  };

  const handleSubmit = async () => {
    setError("");

    if (selected.length === 0) {
      setError("Please select at least one item.");
      return;
    }
    if (!teamName.trim()) {
      setError("Team Name is required.");
      return;
    }
    if (!remark.trim()) {
      setError("Reason (Remark) is required.");
      return;
    }

    try {
      const requests = selected.map((id) => {
        const item = tableData.find((item) => item.id === id);
        const quantity = parseInt(quantities[id], 10) || 1;

        if (quantity > item.stock) {
          throw new Error(
            `Quantity for '${item.name}' exceeds available stock.`
          );
        }
        if (quantity < 1) {
          throw new Error(`Quantity for '${item.name}' must be at least 1.`);
        }
        if (item.isReturnable && !returnDates[id]) {
          throw new Error(`Return date is required for '${item.name}'.`);
        }

        return {
          id: id,
          quantity: quantity,
          returnDate: item.isReturnable ? returnDates[id] : null,
        };
      });

      const payload = {
        requests,
        projectName: teamName.trim(),
        remark: remark.trim(),
      };

      await multipleItemsSubmit(payload);
      alert("Requests submitted successfully!");

      setSelected([]);
      setQuantities({});
      setReturnDates({});
      setTeamName("");
      setRemark("");
      setShowForm(false);
    } catch (error) {
      setError(error.message || "An error occurred during submission.");
    }
  };

  if (!tableData || tableData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Inventory2Outlined
          sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
        />
        <Typography color="text.secondary">No items available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Selected Items Summary Bar */}
      {selected.length > 0 && (
        <Card
          sx={{
            mb: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selected.length} {selected.length === 1 ? "Item" : "Items"}{" "}
                  Selected
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Complete the form below to submit your request
                </Typography>
              </Box>
              <IconButton
                onClick={() => setShowForm(!showForm)}
                sx={{ color: "white" }}
              >
                {showForm ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Stack>

            <Collapse in={showForm}>
              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Team Name"
                    variant="outlined"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        "& fieldset": { borderColor: "transparent" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reason (Remark)"
                    variant="outlined"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        "& fieldset": { borderColor: "transparent" },
                      },
                    }}
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
                    onClick={handleSubmit}
                    size="large"
                    sx={{
                      bgcolor: "white",
                      color: theme.palette.primary.main,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    }}
                  >
                    Submit Request
                  </Button>
                </Grid>
              </Grid>
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* Items Grid */}
      <Grid container spacing={3}>
        {tableData.map((item) => {
          const isItemSelected = isSelected(item.id);
          const stockStatus = getStockStatus(item.stock);
          const isAvailable = item.stock > 0;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  cursor: isAvailable ? "pointer" : "not-allowed",
                  opacity: isAvailable ? 1 : 0.6,
                  border: isItemSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                  "&:hover": isAvailable
                    ? {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      }
                    : {},
                }}
                onClick={() => isAvailable && handleSelectItem(item.id)}
              >
                {/* Selection Checkbox */}
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
                  <Checkbox
                    checked={isItemSelected}
                    disabled={!isAvailable}
                    sx={{
                      bgcolor: "white",
                      borderRadius: "50%",
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 5 }}>
                  {/* Item Name */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    noWrap
                  >
                    {item.name}
                  </Typography>

                  {/* Value */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Value: {item.value}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* Status Chips */}
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={stockStatus.icon}
                      label={stockStatus.label}
                      color={stockStatus.color}
                      size="small"
                    />
                    {item.isReturnable && (
                      <Chip
                        label="Returnable"
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>

                  {/* Stock Info */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      Available Stock
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {item.stock}
                    </Typography>
                  </Box>

                  {/* Quantity Input - Only show when selected */}
                  {isItemSelected && (
                    <Box onClick={(e) => e.stopPropagation()}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        size="small"
                        defaultValue={1}
                        inputProps={{ min: 1, max: item.stock }}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />

                      {/* Return Date - Only show for returnable items */}
                      {item.isReturnable && (
                        <TextField
                          fullWidth
                          type="datetime-local"
                          label="Return Date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) =>
                            handleReturnDateChange(item.id, e.target.value)
                          }
                          required
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ItemCardDashboard;
