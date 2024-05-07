const globalState = require('../utils/globalState');

exports.validGameRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  if (!globalState.isRoomPresent(roomId))
    return res.status(404).send({ message: 'There is no such room created!!' });

  if (!(userId in roomDetails['users']) && !(roomDetails['owner'] === userId))
    return res.status(401).send({ message: 'You are not authorised to play the game!!' });

  return res.status(200).send(true);
}

exports.validCreatingRoomController = (req, res) => {
  const { userId } = req.userDetails;

  if (globalState.isUserPresent(userId))
    return res.status(403).send({ message: 'You are already present in other room or game' });

  return res.status(200).send(true);
}

exports.validCreatedRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  if (!globalState.isRoomPresent(roomId))
    return res.status(404).send({ message: 'Page not found' });

  if (!(globalState.getRoomDetailsById(roomId)['owner'] === userId))
    return res.status(403).send({ message: 'You are not authorized' });

  return res.status(200).send(true);
}

exports.validJoiningRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId, email } = req.userDetails;

  if (roomId) {
    if (globalState.isUserPresent(userId))
      return res.status(403).send({ message: 'You are already in one of the game rooms' });

    if (!globalState.isRoomPresent(roomId))
      return res.status(404).send({ message: 'Page not found' });

    const roomDetails = globalState.getRoomDetailsById(roomId);
    roomDetails['users'].push(userId);
    globalState.setRoomDetailsById(roomId, roomDetails);

    const username = email.split('@')[0];
    globalState.setSocketIdByUserId(userId, { username, socketId: null });

    return res.status(200).send(true);
  } else {
    if (globalState.isUserPresent(userId))
      return res.status(403).send({ message: 'You are already in one of the game rooms' });

    return res.status(200).send(true);
  }

}

exports.validJoinedRoomController = (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.userDetails;

  if (!globalState.isRoomPresent(roomId))
    return res.status(404).send({ message: 'Page not found' });

  if (!(globalState.getRoomDetailsById(roomId)['users'].includes(userId)))
    return res.status(403).send({ message: 'You are not authorised to play the game' });

  const roomDetails = globalState.getRoomDetailsById(roomId);

  let others = [];

  for (let i in roomDetails['users']) {
    others.push(globalState.getSocketByUserId(roomDetails['users'][i])['username']);
  }

  return res.status(200).send({ owner: globalState.getSocketByUserId(roomDetails['owner'])['username'], others });
}