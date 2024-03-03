import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Grid } from '@mui/material';
import Loading from './Loading';
import fetch from '../../utils/axiosInstance';
import drawitLogo from '../images/drawit_logo3.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(null);

  const onSubmit = (e) => {
    fetch.post('/login', { email, password })
      .then((res) => {
        const data = res.data;
        localStorage.setItem('token', data.token);
        navigate('/');
      })
      .catch((err) => {
        setValid(false);
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
              onChange={(e) => { setEmail(e.target.value) }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              onChange={(e) => { setPassword(e.target.value) }}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        {
          valid === "loading" && (
            <Loading />
          )
        }
        {
          valid !== null && (
            <Typography textAlign={'center'} paddingTop={'10px'} color={'red'}>
              ** Incorrect email or password **
            </Typography>
          )
        }
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
