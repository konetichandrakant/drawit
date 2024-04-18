import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import { ACCEPTED_JOIN_ROOM, CREATE_ROOM, JOIN_ROOM_REQUEST } from '../../utils/constants';

function CreateRoom() {
  // Please enter the code as {xyz...} to enter my room. Lets DrawIt together!!
  document.title = 'Create Room';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { roomId } = useSearchParams();
  const [data, setData] = useState(null);
  const [requestingUsers, setRequestingUsers] = useState(null);
  const [acceptedUsers, setAcceptedUsers] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isRoomPresent, setIsRoomPresent] = useState(null);

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page
  // username + ' was accepted by owner to join the room'

  const intialLoad = async () => {
    if (roomId) {
      try {
        const response = await axios.get('/create-room/' + roomId, {
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
    setSocket(await io.connect(SOCKET_URL + '/room'));
  }

  useEffect(async () => {

    intialLoad();

  }, [])

  useEffect(() => {
    if (socket === null) return;

    socket.emit(CREATE_ROOM, { roomId }, (response) => {
      setData(response.data);
    })

    socket.on(JOIN_ROOM_REQUEST, (response) => {
      const { username } = response.data;
      setRequestingUsers((prev) => { return [...prev, username] })
    })

    socket.on(ACCEPTED_JOIN_ROOM, (response) => {
      setData((prev) => { return { ...prev, others: [...prev.others, response.data] } });
    })
  }, [socket])

  const acceptToJoinRoom = (i) => {
    const users = [...requestingUsers];
    const username = users[i];
    users.splice(i, 1);
    setRequestingUsers(users);
    setAcceptedUsers((prev) => { return [...prev, username] });
  }

  const denyToJoinRoom = (i) => {
    const users = [...requestingUsers];
    users.splice(i, 1);
    setRequestingUsers(users);
  }

  const removeFromRoom = (i) => {
    const users = [...acceptedUsers];
    users.splice(i, 1);
    setAcceptedUsers(users);
  }

  const deleteRoom = () => {
    navigate('/home');
  }

  return (
    <>

      {
        roomId && socket && data && (
          <div style={{ display: 'flex', height: '90vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
              <Typography textAlign={'center'}>
                Owner
              </Typography>

              <Typography textAlign={'center'}>
                ** You **
              </Typography>

              <Typography textAlign={'center'}>
                Requesting to join room
              </Typography>

              {
                data.requestingUsers.map((user, index) => {

                  <div>
                    <Typography textAlign={'center'}>
                      {user.username}
                    </Typography>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Button sx={{ backgroundColor: 'green', color: 'white', margin: '4px' }} onClick={() => { acceptToJoinRoom(index) }}>
                        ACCEPT
                      </Button>

                      <Button sx={{ backgroundColor: 'red', color: 'white', margin: '4px' }} onClick={() => { denyToJoinRoom(index) }}>
                        DENY
                      </Button>
                    </div>
                  </div>
                })
              }

              <Typography textAlign={'center'}>
                Accepted to room
              </Typography>

              {
                data.acceptedUsers.map((user, index) => {
                  <div>
                    <Typography textAlign={'center'}>
                      {user.username}
                    </Typography>

                    <Button sx={{ backgroundColor: 'red', color: 'white', margin: '4px' }} onClick={() => { removeFromRoom(index) }}>
                      REMOVE
                    </Button>
                  </div>
                })
              }

              <Button onClick={() => { deleteRoom() }}>Delete this room</Button>
            </Paper>
          </div>
        )
      }

      {
        roomId && isRoomPresent && (
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
                ** Room with entered ID is not present or you are not authorized **
              </Typography>

              <Button onClick={() => { navigate('/join-room') }}>Click here to create other room</Button>

              <Button onClick={() => { navigate('/home') }}>Click here to navigate to home</Button>
            </Paper>
          </div>
        )
      }
    </>
  )
}

export default CreateRoom