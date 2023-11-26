import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Header from './Header';
import LeaderBoard from './LeaderBoard';
import DrawingArea from './DrawingArea';

function Game() {
  const [store, setStore] = useState(null);

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
    console.log(window.innerHeight, window.innerWidth);
    setStore(mid);
  }, [])

  return (
    <div>
      <Header />
      {
        store && (
          <div style={{ height: 'calc(100vh - 100px)', width: '100vw' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <Box style={{ width: '55vw' }}>
                <DrawingArea drawItem={'strawberry'} width={store.canvasWidth} height={store.canvasHeight} />
              </Box>
              <Box style={{ width: '35vw' }}>
                <LeaderBoard width={store.LeaderBoardWidth} />
              </Box>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Game