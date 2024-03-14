const calculateScore = (results, timeLeft) => {
  let score = 0;
  for (let index in results) {
    const data = results[index];
    if (data['label'] === drawItem) {
      console.log(data['confidence'], results);
      score = (data['confidence'] + ((results.length - index * 2) / results.length)) * 50;
    }
  }
  setScore(score < 0 ? (score * -1) / 10 : score);
  setDrawItem(drawItem);
}