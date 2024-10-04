const validationsService = require('../services/validationsService');

exports.validCreatingRoomController = (req, res) => {
  try {
    validationsService.validCreatingRoomService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating room' });
  }
}

exports.validCreatedRoomController = (req, res) => {
  try {
    validationsService.validCreatedRoomService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating room' });
  }
}

exports.validJoiningRoomController = (req, res) => {
  try {
    validationsService.validJoiningRoomService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating room' });
  }
}

exports.validJoinedRoomController = (req, res) => {
  try {
    validationsService.validJoinedRoomService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating room' });
  }
}

exports.validGameRoomController = (req, res) => {
  try {
    validationsService.validGameRoomService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating room' });
  }
}
