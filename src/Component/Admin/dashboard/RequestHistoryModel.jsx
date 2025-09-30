import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import Config from "../../../Service/Config";

const getStatusChipColor = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

const RequestHistoryModal = ({ open, handleClose }) => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open) {
      fetchRequests();
    }
  }, [open]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${Config.API_BASE_URL}request/getAllRequest`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);

    const sortedData = [...filteredRequests].sort((a, b) => {
      let valueA = a[property];
      let valueB = b[property];

      if (property === "localDateTime") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return isAscending ? valueA - valueB : valueB - valueA;
      } else {
        return isAscending
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      }
    });

    setFilteredRequests(sortedData);
  };

  const filterData = (request, searchTerm) => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    if (!lowerSearch) return true;
    return Object.values(request).some((value) => {
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some((nestedValue) =>
          String(nestedValue).toLowerCase().includes(lowerSearch)
        );
      }
      return String(value).toLowerCase().includes(lowerSearch);
    });
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    const filtered = requests.filter((request) => filterData(request, value));
    setFilteredRequests(filtered);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <Typography sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
          No request history found.
        </Typography>
      );
    }

    if (isMobile) {
      return (
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 0.5 }}>
          {filteredRequests.map((request) => (
            <Card key={request.id} sx={{ mb: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    {request.item.name}
                  </Typography>
                  <Chip
                    label={request.approvalStatus}
                    color={getStatusChipColor(request.approvalStatus)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Requested by:</strong> {request.userName} on <strong>Project:</strong> {request.projectName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Quantity:</strong> {request.quantityRequest}
                </Typography>
                 <Typography variant="body2" color="text.secondary">
                  <strong>Remark:</strong> {request.remark}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {new Date(request.localDateTime).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-head": { backgroundColor: theme.palette.grey[200], fontWeight: "bold" } }}>
              <TableCell>
                <TableSortLabel active={orderBy === "id"} direction={order} onClick={() => handleSort("id")}>ID</TableSortLabel>
              </TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Specification</TableCell>
              <TableCell>Qty Requested</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Approved By</TableCell>
              <TableCell>
                <TableSortLabel active={orderBy === "localDateTime"} direction={order} onClick={() => handleSort("localDateTime")}>
                  Requested At
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request, index) => (
              <TableRow key={request.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover } }}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.item.name}</TableCell>
                <TableCell>{request.item.value}</TableCell>
                <TableCell>{request.item.description}</TableCell>
                <TableCell>{request.quantityRequest}</TableCell>
                <TableCell>
                  <Chip label={request.approvalStatus} color={getStatusChipColor(request.approvalStatus)} size="small" />
                </TableCell>
                <TableCell>{request.userName}</TableCell>
                <TableCell>{request.projectName}</TableCell>
                <TableCell>{request.remark}</TableCell>
                <TableCell>{request.approvedBy || "N/A"}</TableCell>
                <TableCell>{new Date(request.localDateTime).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "90%" },
          maxWidth: "1200px",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 3,
          p: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            Request History
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          label="Search Requests"
          variant="outlined"
          sx={{ mb: 2 }}
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {renderContent()}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RequestHistoryModal;