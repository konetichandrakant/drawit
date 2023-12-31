import React, { useEffect, useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Box, Button, Typography, Paper, useTheme } from "@mui/material";
import ml5 from "ml5";

let classifier;
let canvas;

function DoodleClassifier({ drawItem, width, height, setDrawItem }) {
  const theme = useTheme();
  const [score, setScore] = useState(null);

  useEffect(async () => {
    classifier = await ml5.imageClassifier("DoodleNet");
  }, []);

  const clearCanvas = () => {
    canvas.background(255);
  };

  const sketch = (p5) => {
    p5.setup = () => {
      p5.createCanvas(width, height);
      p5.background(255);
    };

    p5.draw = () => {
      p5.strokeWeight(20);
      p5.stroke(0);

      if (p5.mouseIsPressed) {
        p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
      }
    };

    canvas = p5;
  };

  const calculateScore = (results) => {
    let score = 0;
    for (let index in results) {
      const data = results[index];
      if (data['label'] === drawItem) {
        console.log(data['confidence'], results);
        score = (data['confidence'] + ((results.length - index * 2) / results.length)) * 50;
      }
    }
    setScore(score < 0 ? (score * -1) / 10 : score);
    setDrawItem(drawItem);
  }

  const classifyImage = async () => {
    try {
      const results = await classifier.classify(canvas, 345);
      calculateScore(results);
      clearCanvas(canvas);
    } catch (error) {
      console.error("Error during classification:", error);
    }
  };

  return (
    <Paper
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      {
        score ? (
          <div>
            Your Score - {score}
          </div>
        ) : (
          <>
            <Typography textAlign="center" variant="h5">
              <span style={{ color: 'orange', fontWeight: 700 }}>Draw</span>{' '}
              <span style={{ color: 'blue', fontWeight: 800 }}>-</span>{' '}
              <span style={{ color: 'black', fontWeight: 700 }}>{drawItem}</span>
            </Typography>
            <ReactP5Wrapper sketch={sketch} />
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginBottom: theme.spacing(1),
                width: width,
              }}
            >
              <Button variant="contained" color="primary" onClick={clearCanvas}>
                Clear
              </Button>
              <Button variant="contained" color="primary" onClick={classifyImage}>
                Submit
              </Button>
            </Box>
          </>
        )
      }
    </Paper>
  );
};

export default DoodleClassifier;
