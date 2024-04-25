import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import { ACCEPTED_JOIN_ROOM, JOIN_ROOM_REQUEST } from '../../utils/constants';

function CreateRoom() {
  // Please enter the code as {xyz...} to enter my room. Lets DrawIt together!!
  document.title = 'Create Room';
  const API_URL = process.env.REACT_APP_API_URL;
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  const { roomId } = useParams();
  const [requestingUsers, setRequestingUsers] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isValidUser, setIsValidUser] = useState(null);
  const navigate = useNavigate();

  // Before joining into room validate the roomId
  // After validating and adding you in the room by owner send the request to the same page by adding the link roomId
  // Not authenticated user user who is not in that room should give error page
  // username + ' was accepted by owner to join the room'

  useEffect(() => {

    intialLoad();

  }, [])

  useEffect(() => {
    if (socket === null) return;

    console.log(socket);

    socket.on(JOIN_ROOM_REQUEST, (response) => {
      setRequestingUsers(response.data);
    })

    socket.on(ACCEPTED_JOIN_ROOM, (response) => {
      setAcceptedUsers(response.data);
    })
  }, [socket])

  const intialLoad = async () => {
    axios.get(API_URL + '/valid-created-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then(async (response) => {
      const { isValidUser } = response.data;

      if (!isValidUser)
        return setIsValidUser(false);

      setSocket(io(SOCKET_URL + '/room'));
    }).catch(() => {
      setIsValidUser(false);
    })
  }

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
    axios.delete(API_URL + '/remove-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then(() => {
      navigate('/');
    }).catch(() => {

    })
  }

  return (
    <>
      {
        socket && (
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
                requestingUsers.map((user, index) => {

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
                acceptedUsers.map((user, index) => {
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