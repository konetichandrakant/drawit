import React from "react";
import { ListItem, ListItemText, Box, Typography } from "@mui/material";

// A single leaderboard row: rank, player name, and running total score.
function LeaderBoardElement({ rank, username, score }) {
  return (
    <ListItem divider disableGutters>
      <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
        <Typography sx={{ mr: 2, fontWeight: "bold", minWidth: 28 }}>
          #{rank}
        </Typography>
        <ListItemText primary={username} />
        <Typography fontWeight={500}>{score}</Typography>
      </Box>
    </ListItem>
  );
}

export default LeaderBoardElement;
