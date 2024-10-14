function CanvasFooter({ style, details }) {
    const { numberOfPlayers } = details;

    // <Box
    //     style={{
    //       display: 'flex',
    //       flexDirection: 'row',
    //       justifyContent: 'space-evenly',
    //       marginBottom: theme.spacing(1),
    //       width: width,
    //     }}
    //   >
    //     <Button variant="contained" color="primary" onClick={clearCanvas}>
    //       Clear
    //     </Button>
    //     <Button variant="contained" color="primary" onClick={onDrawingSubmit}>

    //     </Button>
    //     <Button variant="contained" color="primary" onClick={onDrawingSubmit}>
    //       Submit
    //     </Button>
    //   </Box>

    return <>
        <div style={style}>
            {
                numberOfPlayers && (
                    <div></div>
                )
            }

            {
                !numberOfPlayers && (
                    <div></div>
                )
            }
        </div>
    </>
}

export default CanvasFooter;