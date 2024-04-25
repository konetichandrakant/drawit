const { globalState } = require('../utils/globalState');

exports.validGameRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(404).send({ message: 'There is no such room created!!' });

  if (!(userId in roomDetails['users']) && !(roomDetails['owner'] === userId))
    return res.status(401).send({ message: 'You are not authorised to play the game!!' });

  return res.status(200).send({ isValidUser: true });
}

exports.validCreatingRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(404).send({ message: 'Page not found' });

  if (globalState.isUserPresent(userId))
    return res.status(403).send({ message: 'You are already present in other room or game' });

  return res.status(200).send({ isValidUser: true });
}

exports.validCreatedRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(404).send({ message: 'Page not found' });

  if (!(roomDetails['owner'] === userId))
    return res.status(401).send({ message: 'You are not authorized' });

  return res.status(200).send({ isValidUser: true });
}

exports.validJoiningRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(404).send({ message: 'Page not found' });

  if (globalState.isUserPresent(userId))
    return res.status(403).send({ message: 'You are already in one of the game rooms' });

  return res.status(200).send({ isValidUser: true });
}

exports.validJoinedRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  const roomDetails = globalState.getRoomDetailsById(roomId);

  if (!roomDetails)
    return res.status(404).send({ message: 'Page not found' });

  if (!(userId in roomDetails['users']))
    return res.status(401).send({ message: 'You are not authorised to play the game' });

  return res.status(200).send({ isValidUser: true });
}