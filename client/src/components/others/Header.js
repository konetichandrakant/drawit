import React from 'react';
import { useNavigate } from 'react-router-dom';
import drawit_logo from '../../images/drawit_logo.png';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

function Header({ profile }) {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ padding: '3px', margin: '0px', border: '0px', backgroundColor: 'hsl(27,89%,48%)' }} />
      {
        !profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-between' }}>
            <img src={drawit_logo} />
            <span style={{ cursor: 'pointer' }} onClick={() => { console.log('profile'); navigate('/profile'); }}>
              <PersonOutlineIcon sx={{ height: '50px', width: '50px' }} />
            </span>
          </div>
        )
      }
      {
        profile && (
          <div style={{ display: 'flex', height: '50px', margin: '10px', justifyContent: 'space-around' }}>
            <img src={drawit_logo} />
          </div>
        )
      }
      <hr></hr>
    </>
  )
}

export default Header