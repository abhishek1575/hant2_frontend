// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import Config from "../../../Service/Config";

// const RequestHistoryModal = ({ open, handleClose }) => {
//   const [requests, setRequests] = useState([]);

//   // Fetch data from API
//   useEffect(() => {
//     if (open) {
//       const token = sessionStorage.getItem("token");
//       // fetch(`${Config.API_BASE_URL}item/getAllRequest`, {
//         fetch(`${Config.API_BASE_URL}request/getAllRequest`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setRequests(data);
//         })
//         .catch((error) => console.error("Error fetching data:", error));
//     }
//   }, [open]);

//   return (
//     <Modal
//       open={open}
//       onClose={(e, reason) => reason === "backdropClick" && e.stopPropagation()}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "80%",
//           bgcolor: "background.paper",
//           boxShadow: 24,
//           p: 4,
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
//           Request History
//         </Typography>
//         <TableContainer
//           component={Paper}
//           sx={{ maxHeight: "500px", overflow: "auto" }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Item Name</TableCell>
//                 <TableCell>Value</TableCell>
//                 <TableCell>Specification</TableCell>
//                 <TableCell>Quantity Requested</TableCell>
//                 <TableCell>Approval Status</TableCell>
//                 <TableCell>Requested By</TableCell>
//                 <TableCell>Project Name</TableCell>
//                 <TableCell>Remark</TableCell>
//                 <TableCell>Requested At</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {requests.map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>{request.id}</TableCell>
//                   <TableCell>{request.item.name}</TableCell>
//                   <TableCell>{request.item.value}</TableCell>
//                   <TableCell>{request.item.description}</TableCell>
//                   <TableCell>{request.quantityRequest}</TableCell>
//                   <TableCell>{request.approvalStatus}</TableCell>
//                   <TableCell>{request.userName}</TableCell>
//                   <TableCell>{request.projectName}</TableCell>
//                   <TableCell>{request.remark}</TableCell>
//                   <TableCell>
//                     {new Date(request.localDateTime).toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleClose}
//           sx={{ mt: 2 }}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default RequestHistoryModal;


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
} from "@mui/material";
import Config from "../../../Service/Config";

const RequestHistoryModal = ({ open, handleClose }) => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setFilteredRequests(data); // Initialize filteredRequests with all data
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

    const sortedData = [...requests].sort((a, b) => {
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

    setRequests(sortedData);
    setFilteredRequests(
      sortedData.filter((request) => filterData(request, search))
    );
  };

  const filterData = (request, searchTerm) => {
    const lowerSearch = searchTerm.trim().toLowerCase(); // Trim and lowercase the search term
    return (
      request.id.toString().toLowerCase().includes(lowerSearch) ||
      request.item.name.toLowerCase().includes(lowerSearch) ||
      request.item.value.toString().toLowerCase().includes(lowerSearch) ||
      request.item.description.toLowerCase().includes(lowerSearch) ||
      request.quantityRequest.toString().toLowerCase().includes(lowerSearch) ||
      request.approvalStatus.toLowerCase().includes(lowerSearch) ||
      request.userName.toLowerCase().includes(lowerSearch) ||
      request.projectName.toLowerCase().includes(lowerSearch) ||
      request.remark.toLowerCase().includes(lowerSearch) ||
      new Date(request.localDateTime)
        .toLocaleString()
        .toLowerCase()
        .includes(lowerSearch)
    );
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    const filtered = requests.filter((request) => filterData(request, value));
    setFilteredRequests(filtered);
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => reason === "backdropClick" && e.stopPropagation()}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "1200px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Request History
        </Typography>

        <TextField
          label="Search"
          variant="outlined"
          sx={{ mb: 2, width: "100%", maxWidth: "400px" }}
          value={search}
          onChange={handleSearch}
          placeholder="Search by ID, Item Name, Value, etc."
        />

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <TableContainer
          component={Paper}
          sx={{ maxHeight: "500px", overflow: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => handleSort("id")}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Specification</TableCell>
                <TableCell>Quantity Requested</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell>Requested By</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "localDateTime"}
                    direction={orderBy === "localDateTime" ? order : "asc"}
                    onClick={() => handleSort("localDateTime")}
                  >
                    Requested At
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.item.name}</TableCell>
                  <TableCell>{request.item.value}</TableCell>
                  <TableCell>{request.item.description}</TableCell>
                  <TableCell>{request.quantityRequest}</TableCell>
                  <TableCell>{request.approvalStatus}</TableCell>
                  <TableCell>{request.userName}</TableCell>
                  <TableCell>{request.projectName}</TableCell>
                  <TableCell>{request.remark}</TableCell>
                  <TableCell>
                    {new Date(request.localDateTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClose}
          sx={{ mt: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default RequestHistoryModal;