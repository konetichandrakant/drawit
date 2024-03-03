const Game = require('../models/Game');

const getGameDetails = (req, res) => {
  const game = Game.findById(req.params.gameId);

  if (!game)
    return res.status(404);

  return res.status(200).send(game);
}

const postGameDetails = (req, res) => {
  const game = Game.findById(req.gameId);

  if (!game)
    return res.status(404);

  return res.status(200).send(game);
}

module.exports = { getGameDetails, postGameDetails };