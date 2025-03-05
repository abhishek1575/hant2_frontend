import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableContainer,
} from "@mui/material";
import {
  userTableHeaders,
  getSubCategoryDisplayName,
  getStockColor,
  getStockStatusText,
  handleStatusClick,
} from "../../Components/utils/TableHealper"; // Import helpers

const ItemTable = ({
  tableData,
  setSelectedItem,
  setOpenAvailableForm,
  setOpenEditForm,
}) => {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "calc(100vh - 150px)", // Adjusted height dynamically
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {userTableHeaders.map((userTableHeaders, index) => (
                <TableCell
                  key={index}
                  // sx={{ backgroundColor: "#F8FBFC", fontWeight: "bold" }}
                  sx={{ backgroundColor: "#A8D2EF", fontWeight: "bold" }}
                >
                  {userTableHeaders}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  {getSubCategoryDisplayName(row.subCategory)}
                </TableCell>
                <TableCell>{row.manufacturer}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.package_box}</TableCell>
                <TableCell>{row.mpn}</TableCell>
                <TableCell>{row.sap_no}</TableCell>
                <TableCell>{row.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{ textTransform: "none" }}
                    color={getStockColor(row)}
                    onClick={() =>
                      handleStatusClick(
                        row,
                        setSelectedItem,
                        setOpenAvailableForm
                      )
                    }
                  >
                    {getStockStatusText(row)}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ItemTable;
