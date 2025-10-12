export const getUniqueWords = (string: string) => {
  const resultWords: string[] = [];
  string.split(" ").forEach((newWord) => {
    if (!resultWords.some((resultWord) => resultWord === newWord)) {
      resultWords.push(newWord);
    }
  });
  return resultWords;
};
