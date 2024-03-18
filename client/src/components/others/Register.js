import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import drawitLogo from '../images/drawit_logo3.png';

const API_URL = process.env.API_URL;

function Register() {
  const navigate = useNavigate();
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const valid = useRef(null);

  const onSubmit = () => {
    if (password.current.value !== confirmPassword.current.value)
      return valid.current = '** password and confirm password are not same **';
    valid.current = 'Loading...';
    axios.post(API_URL + '/register', {
      email: email.current.value,
      password: password.current.value
    })
      .then((res) => {
        const { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/home');
      })
      .catch(() => {
        valid.current = '** user already exists **';
      })
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto', maxWidth: '35vw' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={drawitLogo} alt={'drawit logo'} style={{ maxHeight: '15vh', maxWidth: '15vw' }} />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              ref={email}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              ref={password}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              ref={confirmPassword}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {
          valid.current !== null && (
            <Typography textAlign={'center'} paddingTop={'10px'} color={'red'}>
              {valid.current}
            </Typography>
          )
        }

        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button type="submit" variant="contained" disabled={valid === 'loading'} color="primary" sx={{ mt: 2, width: '50%' }} onClick={onSubmit} >
            Register
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Register;
