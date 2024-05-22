import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import drawitLogo from '../images/drawit_logo.png';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

function Header({ profile, roomId }) {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: '3px', margin: '0px', border: '0px', backgroundColor: 'hsl(27,89%,48%)' }} />
      {
        !roomId && !profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-between' }}>
            <img src={drawitLogo} />
            <span style={{ cursor: 'pointer' }} onClick={() => { navigate('/profile'); }}>
              <PersonOutlineIcon sx={{ height: '50px', width: '50px' }} />
            </span>
          </div>
        )
      }

      {
        profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-around' }}>
            <img src={drawitLogo} />
          </div>
        )
      }

      {
        roomId && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-between' }}>
            <img src={drawitLogo} />
            <div style={{ display: 'flex', height: '50px', justifyContent: 'right', alignItems: 'center' }}>
              <Button style={{ cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText('Join room to play with us!! ROOM ID to join is ' + roomId + ' and http://localhost:3000/join-room is the link to join') }}>
                Invite to room
              </Button>
            </div>
          </div>
        )
      }
      <hr></hr>
    </>
  )
}

export default Header;