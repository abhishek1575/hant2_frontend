// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Button,
// } from "@mui/material";
// import { getHistoryByUserId } from "../Service/DashboardService"; // Service function to fetch history
// import resultNotFound from "../Component/Image/result-not-found-1.png";

// const HistoryTable = ({ onClose }) => {
//   const [historyData, setHistoryData] = useState([]);
//   const [error, setError] = useState("");

//   // Fetch history data on component mount
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const token = sessionStorage.getItem("token");
//         const userId = sessionStorage.getItem("UserId");

//         const data = await getHistoryByUserId(userId, token);

//         if (Array.isArray(data) && data.length > 0) {
//           setHistoryData(data); // Store data if it's an array
//           setError(""); // Clear any previous error
//         } else {
//           setHistoryData([]); // Ensure historyData is always an array
//           setError(data.message || "No History Found");
//         }
//       } catch (error) {
//         console.error("Error fetching history data:", error);
//         setError("Failed to fetch history data. Please try again later.");
//         setHistoryData([]); // Ensure historyData is an array even on error
//       }
//     };

//     fetchHistory();
//   }, []);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100%", // Take full height of the modal content
//         width: "100%", // Take full width of the modal content
//       }}
//     >
//       {/* Table Container */}
//       {error ? (
//         <Typography
//           color="error"
//           style={{ textAlign: "center", marginTop: "20px" }}
//         >
//           {error}
//         </Typography>
//       ) : (
//         <TableContainer
//           component={Paper}
//           style={{ flex: 1, overflowY: "auto" }}
//         >
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell //"#f5f5f5"
//                   style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
//                 >
//                   Item Name
//                 </TableCell>
//                 <TableCell
//                   style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
//                 >
//                   Item Value
//                 </TableCell>
//                 <TableCell
//                   style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
//                 >
//                   Item Description
//                 </TableCell>
//                 <TableCell
//                   style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
//                 >
//                   Requested Quantity
//                 </TableCell>
//                 <TableCell
//                   style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
//                 >
//                   Approval Status
//                 </TableCell>
//                 <TableCell
//                   style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
//                 >
//                   Date & Time
//                 </TableCell>
//                 <TableCell
//                   style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
//                 >
//                   Remark
//                 </TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {historyData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <img
//                       src={resultNotFound} // Use your image path (place image inside `public/images/`)
//                       alt="No History Found"
//                       style={{
//                         width: "200px",
//                         height: "auto",
//                         marginTop: "20px",
//                       }}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 historyData.map((history) => (
//                   <TableRow key={history.id}>
//                     <TableCell>{history.item.name}</TableCell>
//                     <TableCell>{history.item.value}</TableCell>
//                     <TableCell>{history.item.description}</TableCell>
//                     <TableCell>{history.quantityRequest}</TableCell>
//                     <TableCell>{history.approvalStatus}</TableCell>
//                     <TableCell>{history.localDateTime}</TableCell>
//                     <TableCell>{history.remark}</TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Cancel Button */}
//       <div style={{ marginTop: "16px", textAlign: "right" }}>
//         <Button variant="contained" color="secondary" onClick={onClose}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default HistoryTable;

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { getHistoryByUserId } from "../Service/DashboardService"; // Service function to fetch history
import resultNotFound from "../Component/Image/result-not-found-1.png"; // Ensure correct path

const HistoryTable = ({ onClose }) => {
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState("");

  // Fetch history data on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("UserId");

        const data = await getHistoryByUserId(userId, token);

        if (Array.isArray(data) && data.length > 0) {
          setHistoryData(data); // Store data if it's an array
          setError(""); // Clear any previous error
        } else {
          setHistoryData([]); // Ensure historyData is always an array
          setError(data.message || "No History Found");
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
        setError("Failed to fetch history data. Please try again later.");
        setHistoryData([]); // Ensure historyData is an array even on error
      }
    };

    fetchHistory();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      {/* Show image when there is no data */}
      {historyData.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={resultNotFound}
            alt="No History Found"
            style={{ width: "300px", height: "auto", marginBottom: "16px" }}
          />
          <Typography color="textSecondary">No History Found</Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ flex: 1, overflowY: "auto", maxHeight: "400px" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Item Name
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Item Value
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Item Description
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Requested Quantity
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Approval Status
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Date & Time
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Remark
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#A8D2EF" }}
                >
                  Approved by
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((history) => (
                <TableRow key={history.id}>
                  <TableCell>{history.item.name}</TableCell>
                  <TableCell>{history.item.value}</TableCell>
                  <TableCell>{history.item.description}</TableCell>
                  <TableCell>{history.quantityRequest}</TableCell>
                  <TableCell>{history.approvalStatus}</TableCell>
                  <TableCell>{history.localDateTime}</TableCell>
                  <TableCell>{history.remark}</TableCell>
                  <TableCell>{history.approvedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Cancel Button at Bottom */}
      <Box sx={{ textAlign: "right", marginTop: "16px" }}>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default HistoryTable;
