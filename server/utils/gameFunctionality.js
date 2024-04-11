const { drawItems } = require('./drawingItem');
const globalInstance = require('../../utils/globalState');

exports.generateRoomId = (data) => {
  const { roomDetails } = data;
  for (let i = 1000; i < 10000; i++) {
    if (i in roomDetails)
      continue;
    return i;
  }
}

exports.getNextLevelDrawingItem = (data) => {
  const { gameDetails,userId } = data;

  for (let levelInformation in gameDetails['levelInformation']) {
    if (!(userId in levelInformation['usersInformation'])) {
      return {valid:true,drawingItem:levelInformation['usersInformation']['drawingItem']};
    }
  }

  let excludeDrawings = [];
  gameDetails['levelInformation'].map((info) => { excludeDrawings.push(info['drawingItem']) })

  return generateDrawingItem(excludeDrawings);
}

generateDrawingItem = (excludeDrawings) => {
  // Random drawing item which is not given to any player
  while (true) {
    const randIndex = (drawItems.length * Math.random()) % drawItems.length;
    drawing = drawItems[randIndex];
    if (!(drawing in excludeDrawings)) {
      return drawing;
    }
  }
}