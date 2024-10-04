const globalState = import('../utils/globalState');

exports.scorePredictor = (req, res) => {
    const { userId } = req.userDetails;
    const { roomId } = req.params;
  
    const { drawingImage } = req.body;
  
    const userGameDetails = globalState.getGameDetailsById(roomId);
    globalState.setGameDetailsById(roomId,);
}