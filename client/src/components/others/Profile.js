import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';


const Profile = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(API_URL + '/user', {
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
          <>Loading....</>
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
