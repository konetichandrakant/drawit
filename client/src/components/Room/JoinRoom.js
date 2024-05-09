import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import { ACCEPTED_JOIN_ROOM, DENY_REQUEST, JOIN_ROOM_REQUEST, GET_ALL_DATA } from '../../utils/constants';
import { CircularProgress } from '@mui/material';
import Header from '../others/Header';

function JoinRoom() {
  document.title = 'Join Room';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [data, setData] = useState(null);
  const [denied, setDenied] = useState(null);
  const [isValidUser, setIsvalidUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isRoomPresent, setIsRoomPresent] = useState(null);

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page
  // username + ' was accepted by owner to join the room'

  const preventRefresh = (event) => {
    event.preventDefault();
    event.returnValue = "Data will be lost";
  };

  useEffect(() => {
    if (!data)
      initialLoad();
    window.addEventListener('beforeunload', preventRefresh);

    return () => {
      window.removeEventListener('beforeunload', preventRefresh);
    }

  }, [])

  useEffect(() => {
    if (socket === null) return;

    socket.emit(JOIN_ROOM_REQUEST, { roomId });

    socket.on(DENY_REQUEST, (response) => {
      socket.disconnect();
      setDenied(response);
    })

    socket.on(ACCEPTED_JOIN_ROOM, (response) => {
      if (response.firstLoad) {
        setData(response.data);
      } else {
        setData((prev) => { return { ...prev, others: [...prev.others, response] } });
      }
    })
  }, [socket])

  const initialLoad = () => {
    // Get only the owner details if accepted by owner then get details of all users
    axios.get(API_URL + '/valid-joined-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setData(response.data);

      setSocket(
        io(process.env.REACT_APP_SOCKET_URL + '/room', {
          auth: {
            token: localStorage.getItem('token')
          }
        })
      )
    }).catch((err) => {
      if (err.response.status === 403) {
        setIsvalidUser(false);
      } else {
        setIsRoomPresent(false);
      }
    })
  }

  const exitRoom = (navigateTo) => {

    navigate(navigateTo);
  }

  return (
    <>
      {
        data && (
          <>
            <Header />
            <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'space', flexDirection: 'column' }}>
              <Typography textAlign={'center'} sx={{ margin: '5px' }}>
                <b>Owner</b>
              </Typography>

              <Typography textAlign={'center'} sx={{ margin: '3px' }}>
                {data.owner}
              </Typography>

              {
                data.others && (
                  <>
                    <Typography textAlign={'center'} sx={{ margin: '5px', marginTop: '10px' }}>
                      <b>Other users</b>
                    </Typography>

                    {
                      data.others.map((username) => {
                        return (
                          <Typography textAlign={'center'} sx={{ marginTop: '3px' }}>
                            {username}
                          </Typography>
                        )
                      })
                    }
                  </>
                )
              }

              <Button onClick={() => { exitRoom('/join-room') }}>Exit this room and join other room</Button>

              <Button onClick={() => { exitRoom('/') }}>Exit this room and go to home</Button>
            </div>
          </>
        )
      }

      {
        isValidUser === null && isRoomPresent === null && (!data || !data.others) && denied === null && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color="inherit" />

            <Typography textAlign={'center'} color={'red'}>
              ** Please wait until you will be accepted by owner of the room **
            </Typography>
          </div>
        )
      }

      {
        denied && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                ** Owner has denied your request to join into this room **
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