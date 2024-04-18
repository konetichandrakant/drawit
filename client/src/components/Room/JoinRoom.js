import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import io from "socket.io-client";
import { ACCEPTED_JOIN_ROOM, JOIN_ROOM_REQUEST } from '../../utils/constants';

let details = { roomId: null };

function JoinRoom() {
  document.title = 'Join Room';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { roomId } = useSearchParams();
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [denied, setDenied] = useState(null);
  const [isRoomPresent, setIsRoomPresent] = useState(null);

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page
  // username + ' was accepted by owner to join the room'

  const initialLoad = async () => {
    if (roomId) {
      try {
        const response = await axios.get('/join-room/' + roomId, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })

        setIsRoomPresent(response.data.isRoomPresent);
      } catch (err) {
        navigate('/login');
      }
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

    if (roomId) {
      setSocket(await io.connect(SOCKET_URL + '/room'));
    }
  }

  useEffect(() => {

    initialLoad();

  }, [])

  useEffect(() => {
    if (socket === null) return;

    socket.emit(JOIN_ROOM_REQUEST, { roomId }, (response) => {
      if (response.success) {
        setData(response.data);
      } else {
        setDenied(true);
      }
    })

    socket.on(ACCEPTED_JOIN_ROOM, (response) => {
      setData((prev) => { return { ...prev, others: [...prev.others, response.data] } });
    })
  }, [socket])

  const validate = (roomId) => {
    axios.get(API_URL + '/valid-join-room/' + roomId).then(() => {
      navigate('/join-room/' + roomId);
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
                    type="text"
                    label="Room ID"
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
        roomId && socket && data && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'}>
                Owner
              </Typography>

              <Typography textAlign={'center'}>
                {data.owner.username}
              </Typography>

              <Typography textAlign={'center'}>
                Other users
              </Typography>

              {
                data.others.map((user) => {
                  <Typography textAlign={'center'}>
                    {user.username}
                  </Typography>
                })
              }

              <Button onClick={() => { navigate('/join-room') }}>Exit this room and join other room</Button>

              <Button onClick={() => { navigate('/home') }}>Exit this room and go to home</Button>
            </Paper>
          </div>
        )
      }

      {
        roomId && isRoomPresent && denied && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                ** Room with entered ID has denied your request to join into this room **
              </Typography>

              <Button onClick={() => { navigate('/join-room') }}>Click here to join other room</Button>

              <Button onClick={() => { navigate('/join-room') }}>Click here to naivgate to home</Button>
            </Paper>
          </div>
        )
      }

      {
        isRoomPresent === false && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                ** Room with entered ID is not present **
              </Typography>

              <Button onClick={() => { navigate('/join-room') }}>Click here to join other room</Button>

              <Button onClick={() => { navigate('/home') }}>Click here to naivgate to home</Button>
            </Paper>
          </div>
        )
      }
    </>
  )
}

export default JoinRoom