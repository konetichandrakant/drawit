import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import fetch from '../AxiosInstance';
import Loading from './Loading';
import Header from './Header';

const Profile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('call');
    fetch.get('/user')
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
          <Header profile={true} />
        )
      }

      {
        data === null && (
          <Loading />
        )
      }

      {
        data && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'space' }}>
            <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '300px', justifyContent: 'center', alignItems: 'center' }}>
              profile
            </div>
            <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw-200px', justifyContent: 'center', alignItems: 'center' }}>
              games
            </div>
          </div>
        )
      }
    </>
  )
};

export default Profile;
