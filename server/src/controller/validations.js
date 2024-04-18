const { globalState } = require('../../utils/globalState');

exports.validGameRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(200).send({ error: true, message: 'There is no such room created!!' });

  if (!(userId in roomDetails['users']) && !(roomDetails['owner'] === userId))
    return res.status(404).send({ message: 'You are not authorised to play the game!!' });

  return res.status(200).send(true);
}

exports.validCreateRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(200).send({ error: true, message: 'There is no such room created!!' });

  if (!(roomDetails['owner'] === userId))
    return res.status(404).send({ message: 'You are not authorised to play the game!!' });

  return res.status(200).send(true);
}

exports.validJoinRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(200).send({ error: true, message: 'There is no such room created!!' });

  if (!(userId in roomDetails['users']))
    return res.status(404).send({ message: 'You are not authorised to play the game!!' });

  return res.status(200).send(true);
}