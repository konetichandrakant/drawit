import Button from "@mui/material/Button";

function CreatedRoom({ data, setData }) {
  return (
    <>
      <Paper sx={{ width: '60vw', minWidth: '400px', height: 'auto', paddingLeft: '10px', paddingRight: '10px' }}>
        <Typography textAlign={'center'} variant='h5'>
          Already added users
        </Typography>
        {
          data.added.map((x, ind) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: width }}>
                <Typography>
                  {ind + 1}{") "}{x.username}
                </Typography>
                <Typography>
                  Score: {x.score}
                </Typography>
                <Button>

                </Button>
              </div>
            )
          }
          )
        }
      </Paper>

      <Paper sx={{ width: '40vw', minWidth: '400px', height: 'auto', paddingLeft: '10px', paddingRight: '10px' }}>
        <Typography textAlign={'center'} variant='h5'>
          To be added users
        </Typography>
        {
          data.tobeadded.map((x, ind) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: width }}>
                <Typography>
                  {ind + 1}{") "}{x.username}
                </Typography>
                <Typography>
                  Score: {x.score}
                </Typography>
                <Button onClick={() => { }}></Button>
              </div>
            )
          }
          )
        }
      </Paper>
    </>
  )
}

export default CreatedRoom;
