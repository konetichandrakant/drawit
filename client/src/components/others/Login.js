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

function Login() {
  const navigate = useNavigate();
  const email = useRef(null);
  const password = useRef(null);
  const valid = useRef('');

  const onSubmit = (e) => {
    valid.current = <Typography textAlign={'center'} paddingTop={'10px'}>Loading...</Typography>;

    axios.post(API_URL + '/login', {
      email: email.current.value,
      password: password.current.value
    })
      .then((res) => {
        const { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/home');
      })
      .catch(() => {
        valid.current = <Typography textAlign={'center'} paddingTop={'10px'} color={'red'}>** Incorrect email or password **</Typography>;
      })
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
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
        </Grid>

        {valid.current}

        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '40%' }} onClick={onSubmit} >
            Login
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '40%' }} onClick={() => { navigate('/register') }} >
            Register
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Login;
