import React from 'react';
import drawit_logo3 from '../images/drawit_logo3.png';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Header({ profile }) {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ padding: '3px', margin: '0px', border: '0px', backgroundColor: 'hsl(27,89%,48%)' }} />
      {
        !profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-between' }}>
            <img src={drawit_logo3} />
            <span style={{ cursor: 'pointer' }} onClick={() => { console.log('profile'); navigate('/profile'); }}>
              <PersonOutlineIcon sx={{ height: '50px', width: '50px' }} />
            </span>
          </div>
        )
      }
      {
        profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-around' }}>
            <img src={drawit_logo3} />
          </div>
        )
      }
      <hr></hr>
    </>
  )
}

export default Header