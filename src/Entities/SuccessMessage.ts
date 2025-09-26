import type { Entry } from "./Entry";
import { SystemMessage } from "./SystemMessage";
import dayjs from "dayjs";

export class SuccessMessage extends SystemMessage {
  entry: Entry;

  constructor(entry: Entry) {
    super();
    this.entry = entry;
  }
  toText(): string {
    return (
      `Gasto Registrado!\n` +
      `${this.entry.description}\n` +
      `R$${this.entry.moneyExpent.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}\n` +
      `${this.entry.category ? this.entry.category.name : "Outros"}\n` +
      `Data: ${dayjs(this.entry.createdAtTimestampMiliseconds).format("L HH:mm")}`
    );
  }
}
