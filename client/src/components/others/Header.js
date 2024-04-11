import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import drawitLogo from '../../images/drawit_logo.png';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

function Header({ profile }) {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: '3px', margin: '0px', border: '0px', backgroundColor: 'hsl(27,89%,48%)' }} />
      {
        !profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-between' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => { console.log('profile'); navigate('/profile'); }}>
              <PersonOutlineIcon sx={{ height: '50px', width: '50px' }} />
            </span>
            <img src={drawitLogo} />
            <Button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} sx={{ '&:hover': { backgroundColor: 'red' }, backgroundColor: 'red', color: 'white' }}>
              Log Out
            </Button>
          </div>
        )
      }
      {
        profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-between' }}>
            <img src={drawitLogo} />
            <Button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} sx={{ '&:hover': { backgroundColor: 'red' }, backgroundColor: 'red', color: 'white' }}>
              Log Out
            </Button>
          </div>
        )
      }
      <hr></hr>
    </>
  )
}

export default Header