import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import drawitLogo from '../../images/drawit_logo.png';

let details = { email: '', password: '' };

function Login() {
  document.title = 'Login';
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [valid, setValid] = useState(null);

  const onSubmit = (e) => {
    setValid('Loading...');

    axios.post(API_URL + '/login', details)
      .then((res) => {
        const { token, message } = res.data;
        if (!token)
          return setValid(message);
        localStorage.setItem('token', token);
        navigate('/');
      })
      .catch(() => {
        return setValid('** Some error occured please try again! **');
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
              onChange={(e) => { details = { ...details, email: e.target.value } }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              onChange={(e) => { details = { ...details, password: e.target.value } }}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {
          valid !== null && (
            <Typography textAlign={'center'} paddingTop={'10px'} color={'red'}>
              {valid}
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
