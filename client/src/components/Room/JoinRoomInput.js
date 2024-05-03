import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

let roomId;

function JoinRoomInput() {
  document.title = 'Join Room';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [isValidUser, setIsValidUser] = useState(null);
  const [isRoomPresent, setIsRoomPresent] = useState(null);

  const joinRoom = () => {
    setIsValidUser(null);
    setIsRoomPresent(null);

    axios.get(API_URL + '/valid-joining-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response.data);
      navigate('/join-room/' + roomId);
    }).catch((err) => {
      if (err.response.status === 403) {
        setIsValidUser(false);
      } else {
        setIsRoomPresent(false);
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
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
        <Button onClick={joinRoom}>Enter the room</Button>
      </Paper>

      {
        isValidUser === false && (
          <Typography color={'red'} textAlign={'center'}>
            *** Already present in one of the rooms cant be added into this room ***
          </Typography>
        )
      }

      {
        isRoomPresent === false && (
          <Typography color={'red'} textAlign={'center'}>
            *** No such room is present please enter a valid Room ID ***
          </Typography>
        )
      }
    </div>
  )
}

export default JoinRoomInput