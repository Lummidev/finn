export const getLastNumber = (str: string) => {
  const numberRegex = /(\d+(?:[.,]\d*)?|\.\d+)/g;
  const result = [...str.matchAll(numberRegex)].pop();
  if (!result) return null;
  return {
    lastNumber: result[0],
    index: result.index,
  };
};
