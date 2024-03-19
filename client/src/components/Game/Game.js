import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Header from '../others/Header';
import LeaderBoard from './LeaderBoard';
import DrawingArea from './DrawingArea';

const API_URL = process.env.API_URL;
const token = localStorage.getItem('token');

function Game() {
  const [store, setStore] = useState(null);
  const [score, setScore] = useState(null);
  const [drawItem, setDrawItem] = useState(null);

  useEffect(() => {
    const mid = {
      canvasWidth: '',
      canvasHeight: '',
      LeaderBoardWidth: '',
      LeaderBoardHeight: ''
    };
    mid.canvasHeight = window.innerHeight * (65 / 100);
    mid.canvasWidth = window.innerWidth * (50 / 100);
    mid.LeaderBoardWidth = window.innerWidth * (30 / 100);
    setStore(mid);
  }, [])

  useEffect(() => {
    if (!score || !drawItem) return;
    axios.post(API_URL + '/game', {
      score,
      drawingName: drawItem
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [score, drawItem])

  return (
    <div>
      <Header />
      {
        store && (
          <div style={{ height: 'calc(100vh - 100px)', width: '100vw' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              {
                score ? (
                  <>
                    <Box style={{ width: '55vw' }}>
                      <DrawingArea drawItem={''} width={store.canvasWidth} height={store.canvasHeight} setScore={setScore} setDrawItem={setDrawItem} />
                    </Box>
                    <Box style={{ width: '35vw' }}>
                      <LeaderBoard width={store.LeaderBoardWidth} score={score} />
                    </Box>
                  </>
                ) : (
                  <Box style={{ width: '80vw' }}>
                    <DrawingArea drawItem={''} width={store.canvasWidth} height={store.canvasHeight} setScore={setScore} setDrawItem={setDrawItem} />
                  </Box>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Game


{/* <div>
<Typography textAlign={'center'}>
  Play a game with your friends by entering in a room with ID
</Typography>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <Button sx={{ marginBottom: '40px' }}>
    Enter a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
  </Button>
</div>
</div>
<div>
<Typography textAlign={'center'}>
  Create a room and play with your friends by sharing room ID with your mates
</Typography>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <Button sx={{ marginBottom: '40px' }}>
    Create a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
  </Button>
</div>
</div>
<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
<Typography textAlign={'center'}>
  Number of matches played: {data.matches}
</Typography>
<Typography textAlign={'center'}>
  Number of matches won: {data.matchesWon}
</Typography>
<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
  <Button onClick={() => { }}>
    Click for past matches <ArrowForwardOutlinedIcon sx={{ width: '20px', height: '20px' }} />
  </Button>
</div>
</div> */}