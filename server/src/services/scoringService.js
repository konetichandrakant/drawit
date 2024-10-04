const User = require('../models/User');
const tf = require('@tensorflow/tfjs-node');
const imageUtils = require('../utils/imageUtils');
const { MODEL_URL } = require('../config/config');
const globalState = import('../utils/globalState');

let modelInstance = null;

exports.getModel = async () => {
    if (!modelInstance) {
        modelInstance = await tf.loadGraphModel(MODEL_URL); // Pre-trained model (MobileNet, etc.)
        console.log('Model loaded successfully');
    }
    return modelInstance;
};

exports.scoringService = async (req, res) => {
    const { userId } = req.userDetails;
    const { roomId, image } = req.body;

    try {
        const processedImage = imageUtils.processImage(file.buffer);  // Pre-process the image
        const model = await this.getModel();  // Load the model
        const predictions = await model.predict(processedImage).data();  // Predict using the model

        // Get the top prediction (index of highest confidence)
        const topPrediction = predictions.indexOf(Math.max(...predictions));
        const confidence = Math.max(...predictions);

        addScoreToGameDetails(roomId, userId, score);

        return {
            categoryIndex: topPrediction,
            confidence: confidence
        };
    } catch (error) {
        throw new Error('Prediction failed');
    }
}

const addScoreToGameDetails = (roomId, userId, score) => {
    const gameDetails = globalState.getGameDetailsById(roomId);
    const userGameDetails = gameDetails['users'][userId];

    gameDetails['levels'][userGameDetails['level'] - 1].push({ userId: score });

    userGameDetails['totalScore'] = userGameDetails['totalScore'] + score;
    userGameDetails['level']++;

    gameDetails['users'][userId] = userGameDetails;

    globalState.setRoomDetailsById(gameDetails);
}