import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import { ACCEPTED_JOIN_ROOM, DENY_REQUEST, JOIN_ROOM_REQUEST } from '../../utils/constants';

let socket = io(process.env.REACT_APP_SOCKET_URL + '/room', {
  auth: {
    token: localStorage.getItem('token') // Include token in query string
  }
});

function JoinRoom() {
  document.title = 'Join Room';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [data, setData] = useState(null);
  const [denied, setDenied] = useState(null);
  const [isValidUser, setIsvalidUser] = useState(null);
  const [isRoomPresent, setIsRoomPresent] = useState(null);

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page
  // username + ' was accepted by owner to join the room'

  useEffect(() => {

    if (data === null) {
      initialLoad();
    }

    socket.emit(JOIN_ROOM_REQUEST, { roomId });

    socket.on(DENY_REQUEST, (response) => {
      setDenied(response.data);
    })

    socket.on(ACCEPTED_JOIN_ROOM, (response) => {
      setData((prev) => { return { ...prev, others: [...prev.others, response.data] } });
    })

    return () => {
      if (denied !== null)
        socket.off(DENY_REQUEST);
      socket.off(JOIN_ROOM_REQUEST);
    }

  }, [])

  useEffect(() => {

  }, [socket])

  const initialLoad = () => {
    axios.get(API_URL + '/valid-joined-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setData(response.data);

    }).catch((err) => {

      if (err.response.status === 403) {
        setIsvalidUser(false);
      } else {
        setIsRoomPresent(false);
      }
    })
  }

  return (
    <>
      {
        data && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'}>
                Owner
              </Typography>

              <Typography textAlign={'center'}>
                {data.owner}
              </Typography>

              <Typography textAlign={'center'}>
                Other users
              </Typography>

              {
                data.others.map((user) => {
                  <Typography textAlign={'center'}>
                    {user}
                  </Typography>
                })
              }

              <Button onClick={() => { navigate('/join-room') }}>Exit this room and join other room</Button>

              <Button onClick={() => { navigate('/') }}>Exit this room and go to home</Button>
            </Paper>
          </div>
        )
      }

      {
        isValidUser === null && isRoomPresent === null && !data && !denied && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                Please wait until you will be accepted by owner of the room
              </Typography>

              <Button onClick={() => { navigate('/join-room') }}>Click here to join other room</Button>

              <Button onClick={() => { navigate('/') }}>Click here to navigate to home</Button>
            </Paper>
          </div>
        )
      }

      {
        denied && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                ** Room with entered ID has denied your request to join into this room **
              </Typography>

              <Button onClick={() => { navigate('/join-room') }}>Click here to join other room</Button>

              <Button onClick={() => { navigate('/') }}>Click here to navigate to home</Button>
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

              <Button onClick={() => { navigate('/') }}>Click here to navigate to home</Button>
            </Paper>
          </div>
        )
      }

      {
        isValidUser === false && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                ** You are not allowed to enter into this room because you are already present in one of the rooms **
              </Typography>

              <Button onClick={() => { navigate('/') }}>Click here to navigate to home</Button>
            </Paper>
          </div>
        )
      }
    </>
  )
}

export default JoinRoom