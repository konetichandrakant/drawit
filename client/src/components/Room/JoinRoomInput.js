import React from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

let roomId;

function JoinRoomInput() {
  document.title = 'Join Room';
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
        <Typography textAlign={'center'}>
          Please enter the room ID to join the room. Also, please wait until the owner of the room gives some response to your request!!
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Room ID"
              variant="outlined"
              onChange={(e) => { roomId = e.target.value }}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Button onClick={() => { navigate('/join-room/' + roomId) }}>Enter the room</Button>
      </Paper>
    </div>
  )
}

export default JoinRoomInput