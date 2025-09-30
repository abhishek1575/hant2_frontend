import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  Stack,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axios from "axios";
import Config from "../../../Service/Config";
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import InboxIcon from '@mui/icons-material/Inbox';
import { blue } from '@mui/material/colors';

const HistoryCards = ({ handleClose }) => {
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
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
      setRequests([]); // Set to empty array on error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestAction = async (action, id) => {
    const token = sessionStorage.getItem("token");
    const userName = sessionStorage.getItem("Name");
    const isApprove = action === 'approve';

    const url = isApprove
      ? `${Config.API_BASE_URL}request/approved?requestId=${id}&adminName=${encodeURIComponent(userName)}`
      : `${Config.API_BASE_URL}request/deleteRequest?requestId=${id}&adminName=${encodeURIComponent(userName)}`;

    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    };

    try {
      const response = isApprove 
        ? await axios.post(url, {}, config)
        : await axios.delete(url, config);

      if (response.status === 200) {
        alert(`Request ${isApprove ? 'approved' : 'denied'} successfully!`);
        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
      } else {
        alert(`Failed to ${action} request. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${action} the request:`, error);
      alert(`Error occurred while ${action} the request. Please try again later.`);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (!requests || requests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4, mt: 4 }}>
        <InboxIcon sx={{ fontSize: 80, color: 'grey.300' }} />
        <Typography variant="h5" color="text.secondary" sx={{mt: 2}}>
          No Pending Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All requests have been handled. Great job!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{mb: 3}}>
            Pending Requests
        </Typography>
        <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item key={request.id} xs={12} sm={6} md={4}>
            <Card sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 4,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                }
            }}>
              <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: blue[500] }} aria-label="request-type">
                        {request.item.name.charAt(0)}
                    </Avatar>
                }
                title={request.item.name}
                subheader={`For Project: ${request.projectName}`}
                titleTypographyProps={{ fontWeight: 'bold' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">{request.userName}</Typography>
                    </Stack>
                     <Stack direction="row" spacing={1} alignItems="center">
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">{new Date(request.localDateTime).toLocaleDateString()}</Typography>
                    </Stack>
                    <Divider sx={{my: 1}} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Quantity Requested:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{request.quantityRequest}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                           {request.remark ? `"${request.remark}"` : 'No remark provided.'}
                        </Typography>
                    </Box>
                </Stack>
              </CardContent>
              <Box sx={{flexGrow: 1}} />
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button size="small" color="error" onClick={() => handleRequestAction('deny', request.id)}>Deny</Button>
                <Button size="small" variant="contained" color="success" onClick={() => handleRequestAction('approve', request.id)}>Approve</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HistoryCards;
