import dayjs from "dayjs";
import i18next from "i18next";

export const getUniqueWords = (string: string) => {
  const resultWords: string[] = [];
  string.split(" ").forEach((newWord) => {
    if (!resultWords.some((resultWord) => resultWord === newWord)) {
      resultWords.push(newWord);
    }
  });
  return resultWords;
};
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatRelativeDate = (date: string) => {
  const d = dayjs(date).startOf("date");
  const diff = dayjs().diff(d, "day");
  const { t } = i18next;
  let output: string;
  if (diff <= 1) {
    output = t("relativeDateFormat", { diff, ns: "common" });
  } else if (diff < 7) {
    output = t("weekdayDateFormat", { date: d.toDate(), ns: "common" });
  } else {
    output = t("fullDateFormat", { date: d.toDate(), ns: "common" });
  }
  return capitalize(output);
};
export class AppError extends Error {
  code: string;
  details?: string;
  constructor(code: string, details?: string) {
    super();
    this.code = code;
    this.details = details;
    this.name = "appError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
