import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { CircularProgress } from '@mui/material';
import Header from '../../components/Header';

function Home() {
  document.title = 'Home';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!data)
      initialLoad();
  }, [data])

  const initialLoad = () => {
    axios.get(API_URL + '/home', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then((res) => {
        const { invalidUser, room } = res.data;
        if (invalidUser)
          return navigate('/login');
        if (room)
          return setRoom(room);
        setData(res.data);
      })
      .catch(() => {
        navigate('/login');
      })
  }

  const createRoom = () => {
    axios.get(API_URL + '/valid-creating-room', {
      headers: {
        Authorization: localStorage.getItem('token')
      },
      params: {
        type: 'Create Room'
      }
    }).then((response) => {
      const { roomId } = response.data;
      navigate('/create-room/' + roomId);
    }).catch(() => {
      alert('Cant create room please try again!!');
    })
  }

  const joinRoom = () => {
    axios.get(API_URL + '/valid-joining-room', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response.data);
      navigate('/join-room');
    }).catch((err) => {
      alert('You are already present in one of the game rooms, so you cant join in other');
      console.log(err);
    })
  }

  const resumePlay = () => {
    const { roomId } = room;
    console.log(roomId);
  }

  return (
    <>
      {
        data && (
          <>
            <Header />
            <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'space' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div>
                  <Typography textAlign={'center'}>
                    Get random drawings for your practice
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button sx={{ marginBottom: '40px' }} onClick={() => navigate('/game')}>
                      Practice drawing <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
                    </Button>
                  </div>
                </div>
                <div>
                  <Typography textAlign={'center'}>
                    Play with your friends by creating a room
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button sx={{ marginBottom: '40px' }} onClick={() => createRoom()}>
                      Create a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
                    </Button>
                  </div>
                </div>
                <div>
                  <Typography textAlign={'center'}>
                    Play with your friends by joining in a room
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button sx={{ marginBottom: '40px' }} onClick={joinRoom}>
                      Join a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
                  <Typography textAlign={'center'}>
                    Number of matches played: {data.noOfGamesPlayed}
                  </Typography>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Button onClick={() => { navigate('/games') }}>
                      Click for past matches details <ArrowForwardOutlinedIcon sx={{ width: '20px', height: '20px' }} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }

      {
        room && (
          <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'space', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '10px', justifyContent: 'center', alignItems: 'center' }}>
              <Typography textAlign={'center'} sx={{ margin: '5px', fontSize: '8px' }} color={'red'}>
                You are already present in the room please click below button to resume the play
              </Typography>

              <Button onClick={resumePlay}>Resume play <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} /></Button>
            </div>
          </div>
        )
      }

      {
        !room && !data && (
          <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'space', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '10px', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color="inherit" />

              <Typography textAlign={'center'} sx={{ margin: '5px', fontSize: '8px' }} color={'red'}>
                ** If still not loaded after much time please re-load the page **
              </Typography>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Home;