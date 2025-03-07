import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import Config from "../../../Service/Config";

const HistoryCards = ({ getAllData, handleClose, data }) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [fromData, setFormData] = useState(data);

  // Fetch data on component mount
  const fetchRequests = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        `${Config.API_BASE_URL}request/getAllNonApprovedRequests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRequests(response.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("No Request Available.");
    }
    getAllData();
  };

  useEffect(() => {
    setFormData(data); // Update formData when data changes
  }, [data]);

  useEffect(() => {
    fetchRequests();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Approve request handler
  const handleApprove = async (id) => {
    const token = sessionStorage.getItem("token");
    const userName = sessionStorage.getItem("Name");

    try {
      const response = await axios.post(
        `${
          Config.API_BASE_URL
        }request/approved?requestId=${id}&adminName=${encodeURIComponent(
          userName
        )}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Request approved successfully!");

        // Optimistically update the state
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );
      } else {
        alert("Failed to approve request. Please try again.");
      }
    } catch (error) {
      console.error("Error approving the request:", error);
      alert(
        "Error occurred while approving the request. Please try again later."
      );
    }
    getAllData();
  };

  // Deny request handler
  const handleDeny = async (id) => {
    const token = sessionStorage.getItem("token");
    const userName = sessionStorage.getItem("Name"); // Fetch adminName from sessionStorage

    try {
      const response = await axios.delete(
        `${
          Config.API_BASE_URL
        }request/deleteRequest?requestId=${id}&adminName=${encodeURIComponent(
          userName
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Request denied successfully!");

        // Optimistically update the state
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );
      } else {
        alert("Failed to deny request. Please try again.");
      }
    } catch (error) {
      console.error("Error denying the request:", error);
      alert(
        "Error occurred while denying the request. Please try again later."
      );
    }
  };

  return (
    <Paper style={{ padding: "20px" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity Requested</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.item.name}</TableCell>
                <TableCell>{request.item.value}</TableCell>
                <TableCell>{request.item.description}</TableCell>
                <TableCell>{request.quantityRequest}</TableCell>
                <TableCell>
                  {new Date(request.localDateTime).toLocaleString()}
                </TableCell>
                <TableCell>{request.userName}</TableCell>
                <TableCell>{request.projectName}</TableCell>
                <TableCell>{request.remark}</TableCell>
                <TableCell>{request.approved ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(request.id)}
                      style={{ width: "100px" }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeny(request.id)}
                      style={{ width: "100px" }}
                    >
                      Deny
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default HistoryCards;

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TableContainer,
//   Paper,
//   Button,
//   Typography,
//   Box,
// } from "@mui/material";
// import axios from "axios";
// import Config from "../../../Service/Config";

// const HistoryCards = ({ getAllData, handleClose, data }) => {
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState(null);
//   const [fromData, setFormData] = useState(data);

//   // Fetch data on component mount
//   const fetchRequests = async () => {
//     const token = sessionStorage.getItem("token");
//     try {
//       const response = await axios.get(
//         // `${Config.API_BASE_URL}item/getAllNonApprovedRequests`,
//         `${Config.API_BASE_URL}request/getAllNonApprovedRequests`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setRequests(response.data);
//     } catch (err) {
//       console.error("Error fetching requests:", err);
//       setError("Failed to fetch data. Please try again later.");
//     }
//     getAllData();
//   };

//   useEffect(() => {
//     setFormData(data); // Update formData when data changes
//   }, [data]);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   if (error) {
//     return <Typography color="error">{error}</Typography>;
//   }

//   // Approve request handler
//   const handleApprove = async (id) => {
//     const token = sessionStorage.getItem("token");

//     try {
//       const response = await axios.post(
//         `${Config.API_BASE_URL}request/approved?requestId=${id}`,
//         {},
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("Request approved successfully!");

//         // Optimistically update the state
//         setRequests((prevRequests) =>
//           prevRequests.filter((request) => request.id !== id)
//         );
//       } else {
//         alert("Failed to approve request. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error approving the request:", error);
//       alert(
//         "Error occurred while approving the request. Please try again later."
//       );
//     }
//     getAllData();
//   };

//   // Deny request handler
//   const handleDeny = async (id) => {
//     const token = sessionStorage.getItem("token");

//     try {
//       const response = await axios.delete(
//         // `${Config.API_BASE_URL}item/deleteRequest?requestId=${id}`,
//         `${Config.API_BASE_URL}request/deleteRequest?requestId=${id}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("Request denied successfully!");

//         // Optimistically update the state
//         setRequests((prevRequests) =>
//           prevRequests.filter((request) => request.id !== id)
//         );
//       } else {
//         alert("Failed to deny request. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error denying the request:", error);
//       alert(
//         "Error occurred while denying the request. Please try again later."
//       );
//     }
//   };

//   return (
//     <Paper style={{ padding: "20px" }}>
//       <TableContainer>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               {/* <TableCell>Request ID</TableCell> */}
//               <TableCell>Name</TableCell>
//               <TableCell>Value</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Quantity Requested</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>User Name</TableCell>
//               <TableCell>Project Name</TableCell>
//               <TableCell>Remark</TableCell>
//               <TableCell>Approved</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {requests.map((request) => (
//               <TableRow key={request.id}>
//                 {/* <TableCell>{request.id}</TableCell> */}
//                 <TableCell>{request.item.name}</TableCell>
//                 <TableCell>{request.item.value}</TableCell>
//                 <TableCell>{request.item.description}</TableCell>
//                 <TableCell>{request.quantityRequest}</TableCell>
//                 <TableCell>
//                   {new Date(request.localDateTime).toLocaleString()}
//                 </TableCell>
//                 <TableCell>{request.userName}</TableCell>
//                 <TableCell>{request.projectName}</TableCell>
//                 <TableCell>{request.remark}</TableCell>
//                 <TableCell>{request.approved ? "Yes" : "No"}</TableCell>
//                 <TableCell>
//                   <Box display="flex" gap={1}>
//                     <Button
//                       variant="contained"
//                       color="success"
//                       onClick={() => handleApprove(request.id)}
//                       style={{ width: "100px" }}
//                     >
//                       Approve
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       onClick={() => handleDeny(request.id)}
//                       style={{ width: "100px" }}
//                     >
//                       Deny
//                     </Button>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// };

// export default HistoryCards;
