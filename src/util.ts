export const getUniqueWords = (string: string) => {
  const resultWords: string[] = [];
  string.split(" ").forEach((newWord) => {
    if (!resultWords.some((resultWord) => resultWord === newWord)) {
      resultWords.push(newWord);
    }
  });
  return resultWords;
};
export const formatNumberWithoutSeparators = (num: number) => {
  const formatter = Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const parts = formatter.formatToParts(num);
  parts
    .filter((part) => part.type === "group")
    .forEach((part) => (part.value = ""));
  const formatted = parts.map((part) => part.value).join("");
  return formatted;
};
export const abbreviateNumber = (num: number) => {
  const formatter = Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const alternateFormatter = Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  });
  return num < 1000
    ? formatter.format(num)
    : num < 1000000
      ? alternateFormatter.format(num / 1000) + " mil"
      : alternateFormatter.format(num / 1000000) + " Mi";
};
