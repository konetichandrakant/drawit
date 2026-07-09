import React from "react";
import { Paper, Typography, List } from "@mui/material";
import LeaderBoardElement from "./LeaderBoardElement";

// Renders the room's live standings. `scores` is the game's users map
// ({ [userId]: { username, totalScore, level, status } }), broadcast by the
// server after every submitted drawing.
function LeaderBoard({ width, scores }) {
  const entries = scores
    ? Object.entries(scores).map(([userId, details]) => ({
        userId,
        username: (details && details.username) || "Player",
        totalScore: (details && details.totalScore) || 0,
      }))
    : [];

  entries.sort((a, b) => b.totalScore - a.totalScore);

  return (
    <Paper
      elevation={3}
      style={{ width, padding: "16px", maxHeight: "100%", overflow: "auto" }}
    >
      <Typography variant="h6" gutterBottom>
        Leaderboard
      </Typography>
      {entries.length === 0 ? (
        <Typography color="textSecondary">No scores yet</Typography>
      ) : (
        <List disablePadding>
          {entries.map((entry, index) => (
            <LeaderBoardElement
              key={entry.userId}
              rank={index + 1}
              username={entry.username}
              score={entry.totalScore}
            />
          ))}
        </List>
      )}
    </Paper>
  );
}

export default LeaderBoard;
