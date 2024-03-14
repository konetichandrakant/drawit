const { drawItems } = require('./drawingItem');

exports.generateRoomId = (data) => {
  const { roomDetails } = data;
  for (let i = 1000; i < 10000; i++) {
    if (i in roomDetails)
      continue;
    return i;
  }
}

exports.getNextLevelDrawingItem = (data) => {
  const { gameDetails, roomId, username } = data;
  const gDetails = gameDetails[roomId];

  for (let levelInformation in gDetails['levelInformation']) {
    if (!(username in levelInformation['usersInformation'])) {
      return levelInformation['usersInformation']['drawingItem'];
    }
  }

  let excludeDrawings = [];
  gDetails['levelInformation'].map((info) => { excludeDrawings.push(info['drawingItem']) })

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