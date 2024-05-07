import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Header from '../others/Header';

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
    }).then(() => {
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
    <>
      <Header />

      <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto', width: '400px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography textAlign={'center'} sx={{ marginBottom: '20px' }}>
              <b>Enter the <span style={{ color: 'blue' }}>ROOM-ID</span> to join the room</b>
            </Typography>

            <TextField
              type="text"
              label="Room ID"
              variant="outlined"
              onChange={(e) => { roomId = e.target.value }}
              required
            />

            {
              isValidUser === false && (
                <Typography color={'red'} textAlign={'center'} sx={{ marginTop: '10px' }}>
                  *** Already present in one of the rooms ***
                </Typography>
              )
            }

            {
              isRoomPresent === false && (
                <Typography color={'red'} textAlign={'center'} sx={{ marginTop: '10px' }}>
                  *** Enter a valid Room ID ***
                </Typography>
              )
            }

            <Button sx={{ marginTop: '20px' }} onClick={joinRoom}>Enter the room</Button>

          </div>
        </Paper>


      </div>
    </>
  )
}

export default JoinRoomInput