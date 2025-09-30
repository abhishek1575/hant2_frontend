import React from "react";
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
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  CardActions,
} from "@mui/material";
import {
  userTableHeaders,
  getSubCategoryDisplayName,
  getStockColor,
  getStockStatusText,
  handleStatusClick,
} from "../../Components/utils/TableHealper";

const ItemTable = ({
  tableData,
  setSelectedItem,
  setOpenAvailableForm,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!tableData || tableData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="text.secondary">No items match the current filters.</Typography>
      </Box>
    );
  }

  const renderDesktopTable = () => (
    <TableContainer sx={{ maxHeight: 'calc(100vh - 320px)', overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ "& .MuiTableCell-head": { backgroundColor: theme.palette.grey[200], fontWeight: "bold" } }}>
            {userTableHeaders.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={row.id} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover } }}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                <Chip label={getSubCategoryDisplayName(row.subCategory)} size="small" />
              </TableCell>
              <TableCell>{row.manufacturer}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{row.package_box}</TableCell>
              <TableCell>{row.mpn}</TableCell>
              <TableCell>{row.sap_no}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{row.stock}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ textTransform: "none" }}
                  color={getStockColor(row)}
                  onClick={() =>
                    handleStatusClick(row, setSelectedItem, setOpenAvailableForm)
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
  );

  const renderMobileCards = () => (
    <Stack spacing={2} sx={{ maxHeight: 'calc(100vh - 280px)', overflow: "auto", p: 1 }}>
      {tableData.map((row) => (
        <Card key={row.id} elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {row.name}
              </Typography>
              <Chip label={getSubCategoryDisplayName(row.subCategory)} color="primary" size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {row.description}
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                <Typography variant="body2"><strong>Stock:</strong> {row.stock}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {row.location}</Typography>
                <Typography variant="body2"><strong>MPN:</strong> {row.mpn}</Typography>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
             <Button
                  variant="contained"
                  sx={{ textTransform: "none", width: '100%' }}
                  color={getStockColor(row)}
                  onClick={() =>
                    handleStatusClick(row, setSelectedItem, setOpenAvailableForm)
                  }
                >
                  {getStockStatusText(row)}
                </Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );

  return isMobile ? renderMobileCards() : renderDesktopTable();
};

export default ItemTable;