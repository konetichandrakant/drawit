const { drawItems } = require('./drawingItem');

exports.generateRoomId = (data) => {
  const { roomDetails } = data;
  for (let i = 1000; i < 10000; i++) {
    if (i in roomDetails)
      continue;
    return i;
  }
}

exports.refreshPage = (data) => {

}

exports.getDrawingItem = (data)=>{
  
}