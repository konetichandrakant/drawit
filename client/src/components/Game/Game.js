import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Header from '../others/Header';
import LeaderBoard from './LeaderBoard';
import DrawingArea from './DrawingArea';

let level = 0;

function Game({ drawItem }) {
  document.title = 'Game';
  const API_URL = process.env.REACT_APP_API_URL;
  const { roomId } = useParams();
  const [dimensions, setDimensions] = useState(null);
  const [drawingItem, setDrawingItem] = useState(null);
  const [gameFinished, setGameFinished] = useState(null);

  // Final score

  const intialLoad = () => {
    axios.get(API_URL + '/valid-game-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then((res) => {
        setDrawingItem(res.data.drawingItem);
        dimensionsHandler();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const dimensionsHandler = () => {
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
  }

  useEffect(() => {

    intialLoad();

  }, [])

  const nextLevel = (prevScore) => {
    axios.post(API_URL + '/game-room/score/' + roomId, { drawingItem, score: prevScore }, {
      headers: {
        Authorization: localStorage.getItem('token')
      },
      params: {
        level
      }
    }).then((res) => {
      const { gameFinished, drawingItem } = res.data;

      if (gameFinished)
        return setGameFinished(gameFinished);

      setDrawingItem(drawingItem);
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <>
      {
        dimensions && (
          <div>
            <Header />
            <div style={{ height: 'calc(100vh - 100px)', width: '100vw' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                {
                  score ? (
                    <>
                      <Box style={{ width: '55vw' }}>
                        <DrawingArea drawingItem={drawingItem} width={dimensions.canvasWidth} height={dimensions.canvasHeight} />
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
          </div>
        )
      }

      {
        gameFinished && (
          <>Game finished</>
        )
      }
    </>
  )
}

export default Game