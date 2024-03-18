import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import axios from 'axios';
import Header from './Header';

const API_URL = process.env.API_URL;
const token = localStorage.getItem('token');

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  // Data received should be in the below format
  // { matchesPlayed : Number }

  useEffect(() => {
    axios.post(API_URL + '/home', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
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