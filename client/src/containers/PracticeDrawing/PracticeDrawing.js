import Header from "../../components/Header";
import DrawingArea from "../../components/Canvas/DrawingArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  classifyDrawing,
  scoreDrawing,
  topGuess,
} from "../../utils/doodleClassifier";

const API_URL = process.env.REACT_APP_API_URL;

function PracticeDrawing() {
  const [drawingItem, setDrawingItem] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const fetchDrawingItem = () => {
    setError(null);
    setResult(null);
    setDrawingItem(null);
    axios
      .get(API_URL + "/get-drawing-item", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        setDrawingItem(response.data["drawingItem"]);
      })
      .catch((err) => {
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          navigate("/login");
        } else if (err.response && err.response.status >= 500) {
          setError(err.response.data.message || "Server error");
        } else {
          setError("Could not load a drawing prompt");
        }
      });
  };

  useEffect(() => {
    fetchDrawingItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Classify the canvas with DoodleNet and score it against the target prompt.
  // Scoring runs entirely in the browser, so there is no longer any need to
  // POST the drawing to the backend.
  const handleSubmit = async (canvasEl) => {
    setSubmitting(true);
    setResult(null);
    try {
      const results = await classifyDrawing(canvasEl);
      const score = scoreDrawing(results, drawingItem);
      setResult({ score, guess: topGuess(results) });
    } catch (err) {
      console.error(err);
      setError("Could not score the drawing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
        }}
      >
        {drawingItem && (
          <DrawingArea
            drawingItem={drawingItem}
            onSubmit={handleSubmit}
            submitting={submitting}
            width={480}
            height={480}
          />
        )}

        {result && (
          <div style={{ textAlign: "center" }}>
            <Typography variant="h5">Score: {result.score}/100</Typography>
            {result.guess && (
              <Typography color="textSecondary">
                Model guessed: {result.guess.label} ({result.guess.score}%)
              </Typography>
            )}
            <Button variant="text" onClick={fetchDrawingItem} sx={{ mt: 1 }}>
              Try another prompt
            </Button>
          </div>
        )}

        {!error && !drawingItem && (
          <div
            style={{
              display: "flex",
              height: "calc(100vh - 100px)",
              width: "100vw",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        )}

        {error && !drawingItem && (
          <Typography color="red">{error}</Typography>
        )}
      </div>
    </>
  );
}

export default PracticeDrawing;
