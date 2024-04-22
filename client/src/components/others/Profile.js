import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

const Profile = () => {
  document.title = 'Profile';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {

    initialLoad();

  }, [])

  const initialLoad = () => {
    axios.get(API_URL + '/profile', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        navigate('/login');
      })
  }

  return (
    <>
      {
        data && (
          <Header profile={true} />
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
                  Email: {data.email}
                </Typography>
              </div>
              <div>
                <Typography textAlign={'center'}>
                  Username: {data.username}
                </Typography>
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
};

export default Profile;
