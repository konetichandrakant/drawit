import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { roomId } = useParams();
  console.log(useParams());
  const [data, setData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [denied, setDenied] = useState(null);
  const [isRoomPresent, setIsRoomPresent] = useState(null);

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page
  // username + ' was accepted by owner to join the room'

  const initialLoad = () => {
    if (roomId) {
      axios.get(API_URL + '/valid-join-room/' + roomId, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(async (response) => {
        const { isRoomPresent } = response.data;

        if (!isRoomPresent)
          return setIsRoomPresent(false);

        setSocket(await io.connect(API_URL + '/room'));
      }).catch(() => {
        setIsRoomPresent(false);
      })
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
              <Button onClick={() => { navigate('/join-room/' + details.roomId) }}>Enter the room</Button>
            </Paper>
          </div>
        )
      }

      {
        roomId && data && (
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
        roomId && denied && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                ** Room with entered ID has denied your request to join into this room **
              </Typography>

              <Button onClick={() => { navigate('/join-room') }}>Click here to join other room</Button>

              <Button onClick={() => { navigate('/home') }}>Click here to naivgate to home</Button>
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