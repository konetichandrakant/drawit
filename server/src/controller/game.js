const gameServices = require('../services/gameService');

exports.createRoomController = async (req, res) => {
  console.log(req);
  try {
    (await gameServices).createRoomService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating a room' });
  }
}

exports.gameHistoryController = async (req, res) => {
  try {
    (await gameServices).gameHistoryService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating a room' });
  }
}

exports.gameDetailsController = async (req, res) => {
  try {
    (await gameServices).gameDetailsService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while creating a room' });
  }
}