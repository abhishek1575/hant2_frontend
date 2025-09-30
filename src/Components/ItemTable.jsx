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
  Box,
} from "@mui/material";
import {
  headers,
  getSubCategoryDisplayName,
  getStockColor,
  getStockStatusText,
  handleStatusClick,
} from "./utils/TableHealper"; // Import helpers

const ItemTable = ({
  tableData,
  setSelectedItem,
  setOpenAvailableForm,
  setOpenEditForm,
}) => {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.value}
                  </TableCell>
                  <TableCell
                    title={row.description}
                    sx={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.description}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {getSubCategoryDisplayName(row.subCategory)}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.manufacturer}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.location}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.package_box}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.mpn}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.sap_no}
                  </TableCell>
                  <TableCell>{row.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{ textTransform: "none", whiteSpace: "nowrap" }}
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
                  <TableCell>
                    <Button
                      sx={{
                        backgroundColor: "#CC6CE7",
                        "&:hover": { backgroundColor: "#D17FD6" },
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                      variant="contained"
                      onClick={() => {
                        setOpenEditForm(true);
                        setSelectedItem(row);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ItemTable;