import React, { useEffect, useState } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import axiosInstance from '../AxiosInstance';

const Profile = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axiosInstance.get('/user-data')
      .then((res) => {

      })
      .catch((res) => {

      })
  }, [])

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Profile
      </Typography>
      <Box>
        <Typography paragraph>Email: user@example.com</Typography>
        <Typography paragraph>Name: John Doe</Typography>
      </Box>
    </Paper>
  );
};

export default Profile;
