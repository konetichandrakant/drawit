import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

let details = { roomId: null };
let io;

function JoinRoom() {
  const navigate = useNavigate();
  const { roomId } = useSearchParams();
  const [validRoom, setValidRoom] = useState(null);

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page

  const validate = (roomId) => {
    setValidRoom('Loading...');
    axios.get('/join-room', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((res) => {
      // After validating the room change the screen below text from loading owner line
      navigate('/join-room/'+roomId);
    }).catch((err) => {
      console.log();
      setValidRoom(false);
    })
  }

  return (
    <>
      {
        !roomId && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'}>
                Please enter the room ID to join the room. Also, please wait until the owner of the room gives some response to your request!!
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    onChange={(e) => { details = { ...details, roomId: e.target.value } }}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              <Button onClick={validate}>Enter the room</Button>
            </Paper>
          </div>
        )
      }

      {
        roomId && (
          <div>

          </div>
        )
      }
    </>
  )
}

export default JoinRoom