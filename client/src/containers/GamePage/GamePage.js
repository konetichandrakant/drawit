import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DrawingArea from '../../components/Canvas/DrawingArea';
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard';
import { NEXT_LEVEL, UPDATE_LEADERBOARD } from '../../utils/constants';
import { classifyDrawing, scoreDrawing } from '../../utils/doodleClassifier';
import { CircularProgress } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;
let gameLevel = 0;

function GamePage() {
  document.title = 'Game';
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);
  const [openLeaderBoard, setOpenLeaderBoard] = useState(null);
  const [drawingItem, setDrawingItem] = useState(null);
  const [socket, setSocket] = useState(null);
  const [scores, setScores] = useState(null);
  const [nextLevelLoading, setNextLevelLoading] = useState(false);
  const [completed, setCompleted] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // When clicked the timer should be stopped 
  // and page should be showing loading icon until score is caculated by API
  // Scoring runs in-browser via DoodleNet (see utils/doodleClassifier); the
  // resulting score is emitted to the server over the socket.

  const nextLevelDrawing = () => {
    if (!socket) return;

    socket.emit(NEXT_LEVEL, { roomId });
  }

  // Classify the submitted canvas with DoodleNet and emit the resulting score
  // so the server can update the room's leaderboard.
  const onDrawingSubmit = async (canvasEl) => {
    if (!socket) return;
    setSubmitting(true);
    try {
      const results = await classifyDrawing(canvasEl);
      const score = scoreDrawing(results, drawingItem);
      socket.emit(UPDATE_LEADERBOARD, { score, roomId, level: gameLevel });
    } catch (err) {
      console.error('Scoring failed', err);
    } finally {
      setSubmitting(false);
    }
  }

  // Keep the local scores in sync with the room-wide leaderboard broadcast.
  useEffect(() => {
    if (!socket) return;
    const handler = (response) => {
      if (response && response.scores) {
        setScores(response.scores);
      }
    };
    socket.on(UPDATE_LEADERBOARD, handler);
    return () => socket.off(UPDATE_LEADERBOARD, handler);
  }, [socket])

  useEffect(() => {
    if (!socket) return;

    nextLevelDrawing();

    socket.on(NEXT_LEVEL, (response) => {
      const { completed, drawingItem } = response;
      if (completed) {
        setCompleted(true);
        socket.disconnect();
      } else {
        gameLevel++;
        setDrawingItem(drawingItem);
      }
    });
  }, [socket])

  useEffect(() => {
    const mid = {
      canvasWidth: '',
      canvasHeight: '',
      LeaderBoardWidth: '',
      LeaderBoardHeight: ''
    };
    mid.canvasHeight = window.innerHeight * (65 / 100);
    mid.canvasWidth = window.innerWidth * (70 / 100);
    mid.LeaderBoardWidth = window.innerWidth * (30 / 100);
    console.log(window.innerHeight, window.innerWidth);
    setStore(mid);
    if (!socket)
      initialLoad();
  }, [])

  const initialLoad = () => {
    axios.get(API_URL + '/valid-game-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      // Get participants data
      const { scores, level } = response.data;
      setScores(scores);
      gameLevel = level;
      setSocket(
        io(process.env.REACT_APP_SOCKET_URL + '/game', {
          auth: {
            token: localStorage.getItem('token')
          }
        })
      )
    }).catch((err) => {
      if (err.response.status === 401) {
        setError('You are not authorised to play the game!!')
      } else if (err.response.status === 404) {
        setError('No such room created!!');
      } else {
        setError('Some error occured, please try again!!');
      }
    })
  }

  const openLeaderBoardHandler = () => {
    setOpenLeaderBoard(true);
  }

  const closeLeaderBoardHandler = () => {
    setOpenLeaderBoard(false);
  }

  console.log(completed, nextLevelLoading, drawingItem, openLeaderBoard, scores);

  return (
    <>
      {
        !completed && !nextLevelLoading && drawingItem && store && (
          <>
            {
              openLeaderBoard && scores && (
                <div style={{ height: 'calc(100vh - 100px)', width: '100vw' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Box style={{ width: '55vw' }}>
                      <DrawingArea level={gameLevel} drawingItem={drawingItem} onSubmit={onDrawingSubmit} submitting={submitting} width={store.canvasWidth} height={store.canvasHeight} />
                    </Box>
                    <Box style={{ width: '35vw' }}>
                      <LeaderBoard width={store.LeaderBoardWidth} scores={scores} />
                    </Box>
                  </div>
                </div>
              )
            }
            {
              !openLeaderBoard && scores && (
                <div style={{ height: 'calc(100vh - 100px)', width: '100vw' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Box style={{ width: '90vw' }}>
                      <DrawingArea level={gameLevel} drawingItem={drawingItem} onSubmit={onDrawingSubmit} submitting={submitting} width={store.canvasWidth} height={store.canvasHeight} />
                    </Box>
                  </div>
                </div>
              )
            }
          </>
        )
      }

      {
        nextLevelLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'space', flexDirection: 'column', marginLeft: '10px', marginRight: '10px' }}>
            <CircularProgress color="inherit" />

            <Typography textAlign={'center'} sx={{ margin: '10px', fontSize: '10px' }} color={'red'}>
              ** If still not loaded after much time please re-load the page **
            </Typography>
          </div>
        )
      }

      {
        error && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', height: '100vh', width: '100vw' }}>
            <Typography textAlign={'center'} fontWeight={500}>
              {error}
            </Typography>

            <Button sx={{ color: 'red' }} onClick={() => { navigate('/') }}>Navigate to home</Button>
          </div>
        )
      }

      {
        completed && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', height: '100vh', width: '100vw' }}>
            <Typography textAlign={'center'} fontWeight={500}>
              Game finished, please check your game dashboard after sometime the standings will be displayed there
            </Typography>

            <Button sx={{ color: 'red' }} onClick={() => { navigate('/') }}>Navigate to home</Button>
          </div>
        )
      }

    </>
  )
}

export default GamePage