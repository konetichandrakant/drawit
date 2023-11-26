import React from 'react';
import { Paper, Typography } from '@mui/material';
import gameData from '../utils/gameData';


function LeaderBoard({ width, height }) {
  console.log(gameData)
  return (
    <>
      <Paper sx={{ width: width, height: height, paddingLeft: '10px', paddingRight: '10px' }}>
        <Typography textAlign={'center'} variant='h5'>
          Leaderboard
        </Typography>
        {
          gameData.leaderBoard.map((x, ind) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: width }}>
                <Typography>
                  {ind + 1}{") "}{x.username}
                </Typography>
                <Typography>
                  Score: {x.score}
                </Typography>
              </div>
            )
          }
          )
        }
      </Paper>
    </>
  )
}

export default LeaderBoard