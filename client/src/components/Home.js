import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import axiosInstance from '../utils/axiosInstance';
import Loading from './Loading';
import Header from './Header';

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('call');
    const token = document.cookie.split('=')[1];
    axiosInstance.get('/', { headers: { cookie: token } })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        navigate('/login');
      })
  }, [setData, navigate])

  return (
    <>
      {
        data && (
          <Header />
        )
      }

      {
        data === null && (
          <Loading />
        )
      }

      {
        data && (
          <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'space' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div>
                <Typography textAlign={'center'}>
                  Play a game with your friends by entering in a room with ID
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button sx={{ marginBottom: '40px' }}>
                    Enter a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
                  </Button>
                </div>
              </div>
              <div>
                <Typography textAlign={'center'}>
                  Create a room and play with your friends by sharing room ID with your mates
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button sx={{ marginBottom: '40px' }}>
                    Create a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
                  </Button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
                <Typography textAlign={'center'}>
                  Number of matches played: {data.matches}
                </Typography>
                <Typography textAlign={'center'}>
                  Number of matches won: {data.matchesWon}
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <Button onClick={() => { }}>
                    Click for past matches <ArrowForwardOutlinedIcon sx={{ width: '20px', height: '20px' }} />
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