import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import axiosInstance from '../../utils/axiosInstance';
import Loading from './Loading';
import Header from './Header';

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log(localStorage.getItem('token'));
    axiosInstance.post('/', { token: localStorage.getItem('token') })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err, 'home');
        navigate('/login');
      })
  }, [])

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
                  Play a random game for your practice
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button sx={{ marginBottom: '40px' }} onClick={() => navigate('/game')}>
                    Play a game <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
                  </Button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
                <Typography textAlign={'center'}>
                  Number of matches played: {data.matchesPlayed}
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