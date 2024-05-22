import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawingArea from '../../components/DrawingArea';
import LeaderBoard from '../../components/LeaderBoard';
import { NEXT_LEVEL, UPDATE_LEADERBOARD } from '../../utils/constants';
import { CircularProgress } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;
let level = 0;

function GamePage() {
  document.title = 'Game';
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [error, setError] = useState(null);
  const [openLeaderBoard, setOpenLeaderBoard] = useState(null);
  const [drawingItem, setDrawingItem] = useState(null);
  const [socket, setSocket] = useState(null);
  const [scores, setScores] = useState(null);
  const [nextLevelLoading, setNextLevelLoading] = useState(false);
  const [completed, setCompleted] = useState(null);

  // When clicked the timer should be stopped 
  // and page should be showing loading icon until score is caculated by API
  // Should remove ml5 from local and make an api call to backend to get score from there for better speed and reduce the bundle size
  const onDrawingSubmit = (score) => {
    socket.emit(UPDATE_LEADERBOARD, { score, roomId, level });
    setNextLevelLoading(true);
  }

  useEffect(() => {
    if (openLeaderBoard) {
      socket.on(UPDATE_LEADERBOARD, (response) => {

      })
    }
    return () => {
      if (socket && openLeaderBoard !== null)
        socket.off(UPDATE_LEADERBOARD);
    }
  }, [openLeaderBoard])

  useEffect(() => {
    if (!socket) return;

    socket.on(NEXT_LEVEL, (response) => {
      setNextLevelLoading(false);
      const { completed, drawingItem } = response;
      if (completed) {
        setCompleted(true);
      } else {
        level++;
        setDrawingItem(drawingItem);
      }
    });
  }, [socket])

  useEffect(() => {
    if (!socket)
      initialLoad();
    return () => {
      socket.disconnect();
    }
  }, [])

  const initialLoad = () => {
    axios.get(API_URL + '/valid-game-room/' + roomId, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      // Get participants data
      const { scores, userLevel } = response.data;
      setScores(scores);
      level = userLevel;
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
        setError('There is no such room created!!');
      } else {
        setError('Some error occured, please try again!!');
      }
    })
  }

  return (
    <>
      {
        !completed && !nextLevelLoading && drawingItem && scores && (
          <>
            {
              openLeaderBoard && (
                <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DrawingArea level={level} drawingItem={drawingItem} onDrawingSubmit={onDrawingSubmit} />
                  <LeaderBoard scores={scores} />
                </div>
              )
            }
            {
              !openLeaderBoard && (
                <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DrawingArea level={level} drawingItem={drawingItem} onDrawingSubmit={onDrawingSubmit} />
                </div>
              )
            }
          </>
        )
      }

      {
        nextLevelLoading && (
          <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'space', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '10px', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color="inherit" />

              <Typography textAlign={'center'} sx={{ margin: '10px' }}>
                Loading please wait.....
              </Typography>

              <Typography textAlign={'center'} sx={{ margin: '10px', fontSize: '8px' }} color={'red'}>
                ** If still not loaded after much time please re-load the page **
              </Typography>
            </div>
          </div>
        )
      }

      {
        error && (
          <Paper elevation={3} sx={{ p: 3 }} style={{ height: 'auto' }}>
            <Typography textAlign={'center'} color={'red'}>
              ** {error} **
            </Typography>

            <Button onClick={() => { navigate('/join-room') }}>Click here to join other room</Button>
            <Button onClick={() => { navigate('/') }}>Click here to navigate to home</Button>
          </Paper>
        )
      }

    </>
  )
}

export default GamePage