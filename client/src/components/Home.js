import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Paper } from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import fetch from '../AxiosInstance';
import Loading from './Loading';

function Home() {
  const [data, setData] = useState(null);
  console.log(data);

  useEffect(() => {
    fetch.get('/')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setData(false);
      })
  }, [])

  useEffect(() => {
    if (data === false) {}
  }, [data])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
      {
        data === null && (
          <Loading />
        )
      }

      {
        data && (
          <Container>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button>
                Enter a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
              </Button>
              <Button>
                Create a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
              </Button>
            </div>
            <Paper>
              <Grid>
                
              </Grid>
              <Button onClick={() => {  }}>
                Click for past matches <ArrowForwardOutlinedIcon sx={{ width: '20px', height: '20px' }} />
              </Button>
            </Paper>
          </Container>
        )
      }
    </div>
  )
}

export default Home