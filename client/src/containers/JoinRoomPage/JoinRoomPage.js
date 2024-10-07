import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
import { ACCEPTED_JOIN_ROOM, DENY_REQUEST, JOIN_ROOM_REQUEST, GET_ALL_DATA, EXIT_ROOM, REMOVE_USER, REMOVED, START_GAME, DELETE_ROOM } from '../../utils/constants';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import Header from '../../components/Header';

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
  const [removed, setRemoved] = useState(null);
  const [deletedRoom, setDeletedRoom] = useState(null);

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

    if (!data.others)
      socket.emit(JOIN_ROOM_REQUEST, { roomId });

    socket.on(GET_ALL_DATA, (response) => {
      setData(response);
    })

    socket.on(DENY_REQUEST, () => {
      socket.disconnect();
      setDenied(true);
    })

    socket.on(REMOVED, () => {
      socket.disconnect();
      setRemoved(true);
    })

    socket.on(ACCEPTED_JOIN_ROOM, (response) => {
      setData((prev) => { return { ...prev, others: [...prev.others, response] } });
    })

    socket.on(START_GAME, () => {
      socket.disconnect();
      navigate('/game/' + roomId);
    })

    socket.on(DELETE_ROOM, () => {
      socket.disconnect();
      setDeletedRoom(true);
    })

    return () => {
      socket.off(JOIN_ROOM_REQUEST);
      socket.off(ACCEPTED_JOIN_ROOM);
      socket.off(START_GAME);
      socket.off(REMOVED);
      socket.off(GET_ALL_DATA);
      socket.off(DELETE_ROOM);
    }
  }, [socket, navigate, setRemoved, setDenied, setData])

  useEffect(() => {
    if (socket === null || data === null) return;

    socket.on(REMOVE_USER, (response) => {
      const { userId } = response;
      const others = [...data.others];

      for (let i = 0; i < others.length; i++) {
        if (others[i]['userId'] === userId) {
          others.splice(i, 1);
          break;
        }
      }

      setData({ ...data, others });
    })

    socket.on(EXIT_ROOM, (response) => {
      const { userId } = response;
      console.log(response);
      const others = [...data.others];

      for (let i = 0; i < others.length; i++) {
        if (others[i]['userId'] === userId) {
          others.splice(i, 1);
          break;
        }
      }

      setData({ ...data, others });
    })

    return () => {
      socket.off(REMOVE_USER);
      socket.off(EXIT_ROOM);
    }
  }, [data, socket])

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
    socket.emit(EXIT_ROOM, { roomId });
    navigate(navigateTo);
  }

  return (
    <>
      {
        !deletedRoom && data && (
          <>
            <Header roomId={roomId} />
            {
              !removed && data && !denied && (
                <div style={{ display: 'flex', height: 'calc(100vh - 100px)', justifyContent: 'center', alignItems: 'space', flexDirection: 'column' }}>
                  <Typography textAlign={'center'} sx={{ margin: '5px' }}>
                    <b>Owner</b>
                  </Typography>

                  <Typography textAlign={'center'} sx={{ margin: '3px' }}>
                    {data.owner}
                  </Typography>

                  {
                    !data.others && (
                      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '10px', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress color="inherit" />

                        <Typography textAlign={'center'} fontWeight={600}>
                          Please wait until you will be accepted by the admin
                        </Typography>
                      </div>
                    )
                  }

                  {
                    data.others && (
                      <>
                        <Typography textAlign={'center'} sx={{ margin: '5px', marginTop: '10px' }}>
                          <b>Other users</b>
                        </Typography>

                        {
                          data.others.map((details) => {
                            return (
                              <Typography textAlign={'center'} sx={{ marginTop: '3px' }}>
                                {details.username}
                              </Typography>
                            )
                          })
                        }
                      </>
                    )
                  }

                  <Button sx={{ color: 'red' }} onClick={() => { exitRoom('/') }}>Exit this room and go to home</Button>
                </div>
              )
            }

            {
              !deletedRoom && denied && (
                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: 'calc(100vh - 100px)', width: '100vw' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography textAlign={'center'} fontWeight={600}>
                      Owner has denied your request to join into this room
                    </Typography>

                    <Button sx={{ color: 'red' }} onClick={() => { navigate('/') }}>Navigate to home</Button>
                  </div>
                </div>
              )
            }

            {
              !deletedRoom && isRoomPresent === false && (
                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: 'calc(100vh - 100px)', width: '100vw' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography textAlign={'center'} fontWeight={600}>
                      Room with entered ID is not present
                    </Typography>

                    <Button sx={{ color: 'red' }} onClick={() => { navigate('/') }}>Navigate to home</Button>
                  </div>
                </div>
              )
            }

            {
              !deletedRoom && isValidUser === false && (
                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: 'calc(100vh - 100px)', width: '100vw' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography textAlign={'center'} fontWeight={600}>
                      You are not allowed to enter into this room because you are already present in one of the rooms
                    </Typography>

                    <Button sx={{ color: 'red' }} onClick={() => { navigate('/') }}>Navigate to home</Button>
                  </div>
                </div>
              )
            }

            {
              !deletedRoom && removed && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', height: 'calc(100vh - 100px)', width: '100vw' }}>
                  <Typography textAlign={'center'} fontWeight={600}>
                    You are removed from the room by the owner
                  </Typography>

                  <Button sx={{ color: 'red' }} onClick={() => { navigate('/') }}>Navigate to home</Button>
                </div>
              )
            }
          </>
        )
      }

      {
        deletedRoom && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', height: '100vh', width: '100vw' }}>
            <Typography textAlign={'center'} fontWeight={500}>
              Admin of this room deleted this room
            </Typography>

            <Button sx={{ color: 'red' }} onClick={() => { navigate('/') }}>Navigate to home</Button>
          </div>
        )
      }

      {
        !deletedRoom && !data && (
          <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color="inherit" />

              <Typography textAlign={'center'} fontWeight={300}>
                Loading...
              </Typography>
            </div>
          </div>
        )
      }
    </>
  )
}

export default JoinRoom