import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Grid } from '@mui/material';
import Loading from './Loading';
import fetch from '../AxiosInstance';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(null);

  const onSubmit = (e) => {
    fetch.post('/login', { email, password })
      .then((res) => {
        const data = res.data;
        
      })
      .catch((res) => {
        setValid(false);
      })
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Login
      </Typography>
      <form>
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
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} onClick={onSubmit}>
          Login
        </Button>
      </form>

      {
        valid !== null && (
          <Typography>
            ** Entered email or password incorrect **
          </Typography>
        )
      }

      {
        valid === "loading" && (
          <Loading />
        )
      }

    </Paper>
  );
};

export default Login;
