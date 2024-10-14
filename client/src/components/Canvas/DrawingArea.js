import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";

function DrawingArea({ style, details }) {
  useEffect(async () => {

  }, []);

  return (
    <canvas
      style={style}
      // ref={canvasRef}
      // className={classes.canvas}
      // onMouseDown={startDrawing}
      // onMouseMove={draw}
      // onMouseUp={stopDrawing}
      // onMouseLeave={stopDrawing}
    />
  );
};

export default DrawingArea;