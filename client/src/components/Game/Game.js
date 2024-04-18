import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Header from '../others/Header';
import LeaderBoard from './LeaderBoard';
import DrawingArea from './DrawingArea';

function Game({ drawItem }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [dimensions, setDimensions] = useState(null);
  const [score, setScore] = useState(null);

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
    setDimensions(mid);
  }, [])

  useEffect(() => {
    const data = { score, drawItem };

    axios.post(API_URL + '/game', data, {
      headers: {
        Authorization: localStorage.getItem('token')
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
        dimensions && (
          <div style={{ height: 'calc(100vh - 100px)', width: '100vw' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              {
                score ? (
                  <>
                    <Box style={{ width: '55vw' }}>
                      <DrawingArea drawItem={drawItem} width={dimensions.canvasWidth} height={dimensions.canvasHeight} setScore={setScore} />
                    </Box>
                    <Box style={{ width: '35vw' }}>
                      <LeaderBoard width={dimensions.LeaderBoardWidth} score={score} />
                    </Box>
                  </>
                ) : (
                  <Box style={{ width: '80vw' }}>
                    <DrawingArea drawItem={drawItem} width={dimensions.canvasWidth} height={dimensions.canvasHeight} setScore={setScore} />
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