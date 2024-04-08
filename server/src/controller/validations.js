const globalState = require('../../utils/globalState');

exports.validRoomController = (req, res) => {
  const { roomId } = req.params;

  const isRoomPresent = globalState.isRoomPresent(roomId);

  return res.status(200).send({ isRoomPresent });
}

exports.validGameController = (req, res) => {
  const { roomId } = req.params;
  const { email } = req.userDetails;

  const gameDetails = globalState.getGameDetailsById(roomId);

  if (!gameDetails)
    return res.status(404).send({ message: '' });

  if (!(email in gameDetails))
    return res.status(404).send({ message: 'You are not authorised to play the game!!' });

  return res.status(200).send(true);
}