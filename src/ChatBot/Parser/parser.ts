import type { Category } from "../../Entities/Category";
import { getLastNumber } from "../../util";
import { testCategories } from "../testCategories";
import { ParserError } from "./ParserError";
import { ParserErrorKind } from "./ParserErrorKind";
interface MessageComponents {
  moneyExpent: number;
  description: string;
  category?: Category;
}

export const getCategory = (message: string) => {
  for (const category of testCategories) {
    const categoryMatches = [
      ...message.matchAll(new RegExp(category.name, "gi")),
    ].shift();
    if (categoryMatches) {
      return {
        word: categoryMatches[0],
        index: categoryMatches.index,
        isCategoryWord: false,
        category,
      };
    }
    for (const word of category.words) {
      const categoryWord = [
        ...message.matchAll(new RegExp(word, "gi")),
      ].shift();
      if (categoryWord) {
        return {
          word: categoryWord[0],
          index: categoryWord.index,
          isCategoryWord: true,
          category,
        };
      }
    }
  }
  return null;
};

const getMoney = (message: string) => {
  const lastNumber = getLastNumber(message);
  if (!lastNumber) {
    throw new ParserError(
      "Não foi detectado valor monetário na mensagem",
      ParserErrorKind.NoMoney,
    );
  }
  const foundNumber = parseFloat(lastNumber.lastNumber.replace(",", "."));

  if (isNaN(foundNumber)) {
    throw new ParserError(
      "Foi detectado valor monetário inválido na mensagem",
      ParserErrorKind.NoMoney,
    );
  }
  return {
    money: foundNumber,
    index: lastNumber.index,
    length: lastNumber.lastNumber.length,
  };
};

const trimWord = (message: string, index: number, length: number) => {
  const wordAtStart = index === 0;
  const wordAtEnd = message.length === index + length;
  let messageWithTrimmedWord: string;
  if (wordAtStart) {
    messageWithTrimmedWord = message.slice(length);
  } else if (wordAtEnd) {
    messageWithTrimmedWord = message.slice(0, index);
  } else {
    messageWithTrimmedWord = message;
  }
  messageWithTrimmedWord =
    messageWithTrimmedWord.length === 0 ? message : messageWithTrimmedWord;
  return messageWithTrimmedWord.trim();
};
export const parseMessageComponents = (message: string): MessageComponents => {
  const moneyFirstPass = getMoney(message);
  let trimmedMessage = trimWord(
    message,
    moneyFirstPass.index,
    moneyFirstPass.length,
  );
  const moneyRemoved = message !== trimmedMessage;
  const categoryInfo = getCategory(trimmedMessage);

  if (categoryInfo && !categoryInfo.isCategoryWord) {
    trimmedMessage = trimWord(
      trimmedMessage,
      categoryInfo.index,
      categoryInfo.word.length,
    );
    if (!moneyRemoved) {
      const moneySecondPass = getMoney(trimmedMessage);
      trimmedMessage = trimWord(
        trimmedMessage,
        moneySecondPass.index,
        moneySecondPass.length,
      );
    }
  }
  return {
    moneyExpent: moneyFirstPass.money,
    description: trimmedMessage,
    category: categoryInfo?.category,
  };
};
