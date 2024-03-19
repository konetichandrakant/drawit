import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function LeaderBoard({ width, height, score, drawingName }) {
  return (
    <>
      <Paper sx={{ width: width, height: height, paddingLeft: '10px', paddingRight: '10px' }}>
        <Typography textAlign={'center'} variant='h5'>
          Drawing Outcome
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', width: width }}>
          <Typography>
            Drawing Name: {drawingName}
          </Typography>
          <Typography>
            Score: {score}
          </Typography>
        </div>
      </Paper>
    </>
  )
}

export default LeaderBoard