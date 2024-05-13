import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import { ACCEPTED_JOIN_ROOM, JOIN_ROOM_REQUEST, DENY_REQUEST, ROOM_CREATED, GET_ALL_DATA, EXIT_ROOM } from '../../utils/constants';
import Header from '../others/Header';

function CreateRoom() {
  // Please enter the code as {xyz...} to enter my room. Lets DrawIt together!!
  document.title = 'Create Room';
  const API_URL = process.env.REACT_APP_API_URL;
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  const { roomId } = useParams();
  const [requestingUsers, setRequestingUsers] = useState(null);
  const [acceptedUsers, setAcceptedUsers] = useState(null);
  const [isValidUser, setIsValidUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page
  // username + ' was accepted by owner to join the room'

  const preventRefresh = (event) => {
    event.preventDefault();
    event.returnValue = "Data will be lost";
  };

  useEffect(() => {
    if (!socket)
      intialLoad();
    window.addEventListener('beforeunload', preventRefresh);

    return () => {
      window.removeEventListener('beforeunload', preventRefresh);
    }
  }, [])

  useEffect(() => {
    if (socket === null) return;

    socket.on(JOIN_ROOM_REQUEST, (response) => {
      setRequestingUsers((prev) => { return prev === null ? [response] : [...prev, response] });
    })

    socket.on(EXIT_ROOM, (response) => {
      let deleted = false;
      if (requestingUsers) {
        for (let i = 0; i < requestingUsers.length; i++) {
          if (requestingUsers[i]['userId'] === response['userId']) {
            let reqUsers = [...requestingUsers];
            reqUsers.splice(i, 1);
            setRequestingUsers(reqUsers);
            deleted = true;
            break;
          }
        }
      }
      if (!deleted) {
        for (let i = 0; i < acceptedUsers.length; i++) {
          if (acceptedUsers[i]['userId'] === response['userId']) {
            let accUsers = [...acceptedUsers];
            accUsers.splice(i, 1);
            setAcceptedUsers(accUsers);
            break;
          }
        }
      }
    })
  }, [socket])

  const intialLoad = async () => {
    axios.get(API_URL + '/valid-created-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setIsValidUser(response.data);

      setSocket(
        io(SOCKET_URL + '/room', {
          auth: {
            token: localStorage.getItem('token') // Include token in query string
          }
        })
      )
    }).catch(() => {
      setIsValidUser(false);
    })
  }

  const acceptToJoinRoom = (i) => {
    const users = [...requestingUsers];
    socket.emit(ACCEPTED_JOIN_ROOM, { userId: requestingUsers[i]['userId'], roomId });
    setAcceptedUsers((prev) => { return prev === null ? [users[i]] : [...prev, users[i]] });
    users.splice(i, 1);
    setRequestingUsers(users);
  }

  const denyToJoinRoom = (i) => {
    const users = [...requestingUsers];
    socket.emit(DENY_REQUEST, { userId: users[i].userId, roomId });
    users.splice(i, 1);
    setRequestingUsers(users);
  }

  const removeFromRoom = (i) => {
    const users = [...acceptedUsers];
    users.splice(i, 1);
    setAcceptedUsers(users);
  }

  const deleteRoom = () => {
    if (!socket) {
      return alert('Room will not be deleted so early');
    }

    axios.delete(API_URL + '/exit-game/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }, params: {
        deleteRoom: true
      }
    }).then(() => {
      socket.disconnect();
      navigate('/');
    }).catch(() => {
      socket.disconnect();
      navigate('/');
    })
  }

  return (
    <>
      {
        isValidUser === null && (
          <>Loading....</>
        )
      }

      {
        isValidUser && (
          <div>
            <Header />
            <div style={{ display: 'flex', height: 'calc(100vh - 100px)', maxWidth: '100vw', justifyContent: 'center', alignItems: 'space', flexDirection: 'column' }}>
              <Typography textAlign={'center'} sx={{ margin: '5px' }}>
                <b>Owner</b>
              </Typography>

              <Typography textAlign={'center'} sx={{ margin: '3px' }}>
                ** You **
              </Typography>

              <Typography textAlign={'center'} sx={{ margin: '5px', marginTop: '10px' }}>
                <b>Requesting to join room</b>
              </Typography>

              {
                (!requestingUsers || requestingUsers.length === 0) && (
                  <Typography textAlign={'center'} sx={{ margin: '3px' }}>
                    --- No one requested to join room ---
                  </Typography>
                )
              }


              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                {
                  requestingUsers && requestingUsers.map((user, index) => {
                    return (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography textAlign={'center'} sx={{ margin: '3px' }}>
                          {user.username}
                        </Typography>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <Button sx={{ '&:hover': { backgroundColor: '#2adc2a' }, backgroundColor: 'green', color: 'white', margin: '4px' }} onClick={() => { acceptToJoinRoom(index) }}>
                            ACCEPT
                          </Button>

                          <Button sx={{ '&:hover': { backgroundColor: '#e94b4b' }, backgroundColor: 'red', color: 'white', margin: '4px' }} onClick={() => { denyToJoinRoom(index) }}>
                            DENY
                          </Button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>

              <Typography textAlign={'center'} sx={{ margin: '5px', marginTop: '10px' }}>
                <b>Accepted to room</b>
              </Typography>

              {
                (!acceptedUsers || acceptedUsers.length === 0) && (
                  <Typography textAlign={'center'} sx={{ margin: '3px' }}>
                    --- No one accepted to join room ---
                  </Typography>
                )
              }

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                {
                  acceptedUsers && acceptedUsers.map((user, index) => {
                    return (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography textAlign={'center'} sx={{ margin: '3px' }}>
                          {user.username}
                        </Typography>

                        <Button sx={{ '&:hover': { backgroundColor: '#e94b4b' }, backgroundColor: 'red', color: 'white', margin: '4px' }} onClick={() => { removeFromRoom(index) }}>
                          DENY
                        </Button>
                      </div>
                    )
                  })
                }
              </div>

              <Button sx={{ color: 'red', marginTop: '5px' }} onClick={deleteRoom}>Delete this room</Button>
            </div>
          </div>
        )
      }

      {
        isValidUser === false && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'} color={'red'}>
                ** You are not owner for this room **
              </Typography>

              <Button onClick={() => { navigate('/') }}>Click here to navigate to home</Button>
            </Paper>
          </div>
        )
      }
    </>
  )
}

export default CreateRoom