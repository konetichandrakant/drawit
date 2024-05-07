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
    <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'space-around', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <img src={drawitLogo} alt={'drawit logo'} style={{ maxHeight: '15vh', maxWidth: '15vw' }} />
        <Typography sx={{ width: '500px' }}>
          <b>
            DrawIt helps to improve your drawing skills and gives you the best experience in the field of drawing
          </b>
        </Typography>
      </div>
      <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: '10px', marginTop: '20px' }}>
          <Button type="submit" variant="contained" onClick={onSubmit} sx={{ width: '300px', backgroundColor: '#0866ff' }} >
            Log in
          </Button>
        </div>

        <hr />

        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: '10px' }}>
          <Button type="submit" variant="contained" onClick={() => { navigate('/register') }} sx={{ backgroundColor: '#42b72a' }}>
            Create new account
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Login;