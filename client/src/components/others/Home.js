import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Header from './Header';

function Home() {
  document.title = 'Home';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  // Data received should be in the below format
  // { matchesPlayed : Number }

  useEffect(() => {
    axios.get(API_URL + '/home', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then((res) => {
        const { invalidUser } = res.data;
        if (invalidUser)
          return navigate('/login');
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        navigate('/login');
      })
  }, [])

  const createRoom = () => {
    axios.get(API_URL + '/create-room', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      const { roomId } = response.data;
      navigate('/create-room/' + roomId);
    }).catch(() => {
      alert('cant create room please try again!!')
    })
  }

  return (
    <>
      {
        data && (
          <Header />
        )
      }

      {
        data === null && (
          <>Loading....</>
        )
      }

      {
        data && (
          <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'space' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div>
                <Typography textAlign={'center'}>
                  Play a random game for your practice
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button sx={{ marginBottom: '40px' }} onClick={() => navigate('/game')}>
                    Play a game <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
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
                  <Button sx={{ marginBottom: '40px' }} onClick={() => navigate('/join-room')}>
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
        )
      }
    </>
  )
}

export default Home