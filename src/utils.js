export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateAnswers = (correctAnswer, allAnswers) => {
  const answers = [correctAnswer];
  while (answers.length < 6) {
    const randomAnswer =
      allAnswers[Math.floor(Math.random() * allAnswers.length)];
    if (!answers.includes(randomAnswer) && randomAnswer !== correctAnswer) {
      answers.push(randomAnswer);
    }
  }
  return shuffleArray(answers);
};
