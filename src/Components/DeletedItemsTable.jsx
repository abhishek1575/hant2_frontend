import React, { useState, useEffect } from "react";
import Config from "../Service/Config";
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { getAllData } from "../Service/DashboardService";

const DeletedItemsTable = ({ open, onClose }) => {
  const [deletedItems, setDeletedItems] = useState([]);

  // Fetch deleted items when modal opens
  useEffect(() => {
    if (open) {
      fetchDeletedItems();
    }
  }, [open]);

        const token = sessionStorage.getItem("token");

 const fetchDeletedItems = async () => {
   const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage

   try {
     const response = await fetch(
       `${Config.API_BASE_URL}item/getAllDeleteItems`,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`, // Use token dynamically
         },
       }
     );

     if (!response.ok) {
       throw new Error("Failed to fetch data");
     }

     const data = await response.json();
     setDeletedItems(data);
   } catch (error) {
     console.error("Error fetching deleted items:", error);
   }
 };


  const handleUndo = async (itemId) => {
    const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage

    try {
      const response = await fetch(
        `${Config.API_BASE_URL}item/undo?id=${itemId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use dynamically retrieved token
          },
        }
      );

      const responseData = await response.text(); // Try reading response

      if (response.ok) {
        // Remove restored item from the table
        setDeletedItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      
      } else {
        console.error("Undo failed:", responseData); // Log server response
      }
    } catch (error) {
      console.error("Error undoing delete:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Deleted Items
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Value</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Manufacturer</strong>
                </TableCell>
                <TableCell>
                  <strong>MPN</strong>
                </TableCell>
                <TableCell>
                  <strong>SAP No</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deletedItems.length > 0 ? (
                deletedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.manufacturer}</TableCell>
                    <TableCell>{item.mpn}</TableCell>
                    <TableCell>{item.sap_no}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUndo(item.id)}
                      >
                        Undo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No deleted items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          sx={{ mt: 2, display: "block", marginLeft: "auto" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default DeletedItemsTable;
