import { CategoryRepository } from "../../Database/CategoryRepository";
import type { Category } from "../../Entities/Category";
import { ParserError } from "./ParserError";
import { ParserErrorKind } from "./ParserErrorKind";
interface MessageComponents {
  moneyExpent: number;
  description: string;
  category?: Category;
}

export const getCategory = async (message: string) => {
  const categories = await CategoryRepository.getAll();
  console.log(categories);
  for (const category of categories) {
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
  const commonNumberRegex = /(\d+(?:[.,]\d*)?|\.\d+)/g;
  const numberRegexWithCurrencySymbol = /R\$(\d+(?:[.,]\d*)?|\.\d+)/g;
  const numberWithCurrencySymbolMatches = [
    ...message.matchAll(numberRegexWithCurrencySymbol),
  ];
  let numberCandidates;
  if (numberWithCurrencySymbolMatches.length !== 0) {
    numberCandidates = numberWithCurrencySymbolMatches;
  } else {
    const commonNumberMatches = [...message.matchAll(commonNumberRegex)];
    if (commonNumberMatches.length === 0) {
      throw new ParserError(
        "Não foi detectado valor monetário na mensagem",
        ParserErrorKind.NoMoney,
      );
    }
    numberCandidates = commonNumberMatches;
  }

  const numbersWithDecimals = numberCandidates.filter((number) =>
    /[.,]/.test(number[0]),
  );
  const finalNumber = (
    numbersWithDecimals.length > 0 ? numbersWithDecimals : numberCandidates
  ).pop();
  if (!finalNumber) {
    throw new ParserError(
      "Não foi detectado valor monetário na mensagem",
      ParserErrorKind.NoMoney,
    );
  }
  const money = parseFloat(finalNumber[0].replace(",", ".").replace("R$", ""));
  if (isNaN(money)) {
    throw new ParserError(
      "Foi detectado valor monetário inválido na mensagem",
      ParserErrorKind.NoMoney,
    );
  }
  return {
    money,
    index: finalNumber.index,
    length: finalNumber[0].length,
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
export const parseMessageComponents = async (
  message: string,
): Promise<MessageComponents> => {
  const moneyFirstPass = getMoney(message);
  let trimmedMessage = trimWord(
    message,
    moneyFirstPass.index,
    moneyFirstPass.length,
  );
  const moneyRemoved = message !== trimmedMessage;
  const categoryInfo = await getCategory(trimmedMessage);

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
