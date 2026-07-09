import React, { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// A drawing surface for the game. Captures freehand strokes with the mouse or
// touch, and on submit hands the raw <canvas> element back to the parent so it
// can be classified by the DoodleNet scorer. Kept free of any ML concerns so it
// stays reusable across practice and multiplayer screens.
const STROKE_COLOR = "#000000";
const BACKGROUND = "#ffffff";
const LINE_WIDTH = 14;

function DrawingArea({
  width = 480,
  height = 480,
  drawingItem,
  onSubmit,
  submitting = false,
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialise the 2D context and paint a white background once the canvas
  // mounts (or when its dimensions change).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = STROKE_COLOR;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, width, height);
    ctxRef.current = ctx;
    setHasDrawn(false);
  }, [width, height]);

  // Translate a pointer event into canvas-space coordinates, accounting for any
  // CSS scaling between the backing store and the displayed element.
  const getPointerPos = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    drawingRef.current = true;
    lastPosRef.current = getPointerPos(event);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const ctx = ctxRef.current;
    const pos = getPointerPos(event);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
    if (!hasDrawn) setHasDrawn(true);
  };

  const stopDrawing = (event) => {
    if (event) event.preventDefault();
    drawingRef.current = false;
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, width, height);
    setHasDrawn(false);
  };

  const handleSubmit = () => {
    if (!hasDrawn || !onSubmit || !canvasRef.current) return;
    onSubmit(canvasRef.current);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
    >
      {drawingItem && (
        <Typography variant="h6" component="p" sx={{ textTransform: "capitalize" }}>
          Draw: {String(drawingItem).replace(/_/g, " ")}
        </Typography>
      )}
      <canvas
        ref={canvasRef}
        style={{
          touchAction: "none",
          background: BACKGROUND,
          border: "1px solid #ccc",
          borderRadius: "4px",
          maxWidth: "100%",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={clearCanvas}
          disabled={submitting || !hasDrawn}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !hasDrawn}
        >
          {submitting ? "Scoring…" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}

export default DrawingArea;
