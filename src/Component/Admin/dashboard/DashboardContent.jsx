import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Collapse,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from "@mui/material";
import {
  GridView,
  TableRows,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { Inventory2, Warning, TrendingUp } from "@mui/icons-material";
import AdminCardDashboard from "./AdminCardDashboard";
import ItemTable from "../../../Components/ItemTable";
import HistoryTable from "../../../Components/HistoryTable";
import DeletedItemsTable from "../../../Components/DeletedItemsTable";
import { applyFilters } from "../../../Components/utils/Filters";

const DashboardContent = ({
  tableData,
  setSelectedItem,
  setOpenEditForm,
  setOpenAvailableForm,
}) => {
  const theme = useTheme();

  // State variables
  const [viewMode, setViewMode] = useState("card");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  // Calculate statistics based on all data
  const totalItems = tableData.length;
  const lowStockItems = tableData.filter(
    (item) => item.stock < 10 && item.stock > 0
  ).length;
  const outOfStockItems = tableData.filter((item) => item.stock <= 0).length;

  // Apply filters - memoized for performance
  const filteredData = useMemo(() => {
    return applyFilters(
      tableData,
      selectedCategory,
      selectedSubCategory,
      searchValue
    );
  }, [tableData, selectedCategory, selectedSubCategory, searchValue]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedSubCategory("All");
    setSearchValue("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header Section with Stats and Filters */}
      <Box
        sx={{
          flexShrink: 0,
          backgroundColor: "background.paper",
          borderBottom: "1px solid #e0e0e0",
          overflowY: "auto",
          maxHeight: "fit-content",
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Container maxWidth="xl">
          {/* Statistics */}
          <Grid
            container
            spacing={2}
            sx={{ mb: 3, justifyContent: "space-around" }}
          >
            <Grid item>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Inventory2 color="primary" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Items
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {totalItems}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Warning color="warning" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Low Stock
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {lowStockItems}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <TrendingUp color="error" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Out of Stock
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {outOfStockItems}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Filters Section */}
          <Collapse in={filtersOpen}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid #e0e0e0",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" component="h2">
                    Filters
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  container
                  justifyContent={{ md: "flex-end" }}
                >
                  <Button size="small" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                  >
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="All">All Categories</MenuItem>
                      <MenuItem value="Asset">Asset</MenuItem>
                      <MenuItem value="Component">Component</MenuItem>
                    </Select>
                    <Select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="All">All Subcategories</MenuItem>
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Mechanics">Tools & Instruments</MenuItem>
                    </Select>
                    <TextField
                      variant="outlined"
                      placeholder="Search items..."
                      size="small"
                      value={searchValue}
                      onChange={(e) =>
                        setSearchValue(e.target.value.toLowerCase())
                      }
                      autoComplete="off"
                      fullWidth
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>

          {/* View Toggle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              gap: 1,
            }}
          >
            <Button
              size="small"
              startIcon={<FilterListIcon />}
              onClick={() => setFiltersOpen(!filtersOpen)}
              variant="text"
            >
              {filtersOpen ? "Hide" : "Show"} Filters
            </Button>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="card">
                <GridView sx={{ mr: 0.5 }} /> Cards
              </ToggleButton>
              <ToggleButton value="table">
                <TableRows sx={{ mr: 0.5 }} /> Table
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Container>
      </Box>

      {/* Scrollable Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2, md: 3 },
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#9e9e9e",
            },
          },
        }}
      >
        <Container maxWidth="xl">
          {viewMode === "card" ? (
            <AdminCardDashboard
              tableData={filteredData}
              setSelectedItem={setSelectedItem}
              setOpenEditForm={setOpenEditForm}
              setOpenAvailableForm={setOpenAvailableForm}
            />
          ) : (
            <ItemTable
              tableData={filteredData}
              setSelectedItem={setSelectedItem}
              setOpenEditForm={setOpenEditForm}
              setOpenAvailableForm={setOpenAvailableForm}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardContent;
