import { getLastNumber } from "../../util";
import { ParserError } from "./ParserError";
import { ParserErrorKind } from "./ParserErrorKind";
interface MessageComponents {
  moneyExpent: number;
  description: string;
}
export const parseMessageComponents = (message: string): MessageComponents => {
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
  const numberAtStart = lastNumber.index === 0;
  const numberAtEnd =
    message.length === lastNumber.index + lastNumber.lastNumber.length;
  let messageWithTrimmedRelevantNumber: string;
  if (numberAtStart) {
    messageWithTrimmedRelevantNumber = message.slice(
      lastNumber.lastNumber.length,
    );
  } else if (numberAtEnd) {
    messageWithTrimmedRelevantNumber = message.slice(0, lastNumber.index - 1);
  } else {
    messageWithTrimmedRelevantNumber = message;
  }
  messageWithTrimmedRelevantNumber =
    messageWithTrimmedRelevantNumber.length === 0
      ? message
      : messageWithTrimmedRelevantNumber;
  return {
    moneyExpent: foundNumber,
    description: messageWithTrimmedRelevantNumber,
  };
};
