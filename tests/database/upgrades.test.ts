import Dexie from "dexie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import V1_initial from "../../src/Database/Versions/V1_initial.ts";
import V2_messageErrors from "../../src/Database/Versions/V2_messageErrors.ts";
import V3_propertyTypos from "../../src/Database/Versions/V3_propertyTypos.ts";
import type { Entry } from "../../src/Entities/Entry.ts";
import { v4 } from "uuid";
import type { Message } from "../../src/Entities/Message.ts";
interface _MessageTypos {
  initialEntryInformation?: {
    moneyExpent: number;
    description: string;
  };

  createdAtTimestampMiliseconds?: number;
}
type MessageWithTypos = Omit<
  Message,
  "initialEntryInformation" | "createdAtTimestampMilliseconds"
> &
  _MessageTypos;
interface _EntryTypos {
  createdAtTimestampMiliseconds?: number;
  updatedAtTimestampMiliseconds?: number;
  moneyExpent?: number;
}
type EntryWithTypos = Omit<
  Entry,
  | "createdAtTimestampMilliseconds"
  | "updatedAtTimestampMilliseconds"
  | "moneySpent"
> &
  _EntryTypos;
describe("Database Upgrades", () => {
  const hourInMs = 3.6e6;
  const minuteInMs = 60000;
  const baseDateInMs = new Date(2026, 5, 12, 11, 0).getTime();
  const entriesTableName = "entries";
  const messagesTableName = "messages";
  const createDatesInMS = {
    A: baseDateInMs - hourInMs,
    B: baseDateInMs + hourInMs,
    C: baseDateInMs + hourInMs * 2,
  };
  const updateDatesInMS = {
    A: createDatesInMS.A + minuteInMs,
    B: createDatesInMS.B + minuteInMs * 6,
  };
  const testEntries: { A: EntryWithTypos; B: EntryWithTypos } = {
    A: {
      id: v4(),
      moneyExpent: 4.9,
      createdAtTimestampMiliseconds: createDatesInMS.A,
      description: "testA",
      updatedAtTimestampMiliseconds: updateDatesInMS.A,
    },
    B: {
      id: v4(),
      moneyExpent: 10.9,
      createdAtTimestampMiliseconds: createDatesInMS.B,
      description: "testB",
      updatedAtTimestampMiliseconds: updateDatesInMS.B,
    },
  };
  const testMessages: {
    firstSuccessMessage: MessageWithTypos;
    secondSuccessMessage: MessageWithTypos;
    errorMessage: MessageWithTypos;
  } = {
    firstSuccessMessage: {
      id: v4(),
      entryID: testEntries.A.id,
      createdAtTimestampMiliseconds: createDatesInMS.A + 1,
      messageType: "success",
      initialEntryInformation: {
        description: testEntries.A.description,
        moneyExpent: 4.0,
      },
    },
    secondSuccessMessage: {
      id: v4(),
      createdAtTimestampMiliseconds: createDatesInMS.B + 1,
      messageType: "success",
      entryID: testEntries.B.id,
      initialEntryInformation: {
        description: testEntries.B.description,
        moneyExpent: testEntries.B.moneyExpent!,
      },
    },
    errorMessage: {
      id: v4(),
      createdAtTimestampMiliseconds: createDatesInMS.C,
      messageType: "error",
      content: "Error text that should be replaced",
    },
  };

  let database: Dexie;
  const upgradeTo = {
    v1: () => {
      database.version(1).stores(V1_initial.stores!);
    },
    v2: () => {
      database.version(2).upgrade(V2_messageErrors.upgrade!);
    },
    v3: () => {
      database
        .version(3)
        .stores(V3_propertyTypos.stores!)
        .upgrade(V3_propertyTypos.upgrade!);
    },
  };
  beforeEach(async () => {
    database = new Dexie("UpgradeTestDB");
    upgradeTo.v1();
    await database
      .table(entriesTableName)
      .bulkAdd([testEntries.A, testEntries.B]);
    await database
      .table(messagesTableName)
      .bulkAdd([
        testMessages.firstSuccessMessage,
        testMessages.secondSuccessMessage,
        testMessages.errorMessage,
      ]);
    database.close();
  });
  afterEach(async () => {
    await database.delete();
    database.close();
  });

  it("Should upgrade to Version 2 and upgrade error message contents to a code", async () => {
    upgradeTo.v2();
    await database.open();
    const messages = (await database
      .table(messagesTableName)
      .toArray()) as MessageWithTypos[];
    expect(messages.length).toBe(3);
    let errorMessageCount = 0;
    for (const message of messages) {
      if (message.messageType === "error") {
        errorMessageCount++;
        expect(message.content).toBeUndefined();
        expect(message.errorCode).toEqual("parserError.noMoney");
      }
    }
    expect(errorMessageCount).toBe(1);
  });

  it("Should upgrade to Version 3 and fix property name typos in Messages and Entries (moneySpent and Milliseconds)", async () => {
    upgradeTo.v2();
    upgradeTo.v3();
    await database.open();
    const messageTable = database.table(messagesTableName);
    const entryTable = database.table(entriesTableName);
    expect(await messageTable.count()).toBe(3);
    expect(await entryTable.count()).toBe(2);
    const getEntry = async (id: string) =>
      (await entryTable.get(id)) as Entry & _EntryTypos;
    const getMessage = async (id: string) =>
      (await messageTable.get(id)) as Message & _MessageTypos;
    const messages = {
      firstSuccessMessage: await getMessage(
        testMessages.firstSuccessMessage.id,
      ),
      secondSuccessMessage: await getMessage(
        testMessages.secondSuccessMessage.id,
      ),
      errorMessage: await getMessage(testMessages.errorMessage.id),
    };
    const entries = {
      A: await getEntry(testEntries.A.id),
      B: await getEntry(testEntries.B.id),
    };
    const checkSuccessMessage = (
      message: Message & _MessageTypos,
      pair: MessageWithTypos,
    ) => {
      expect(message).toBeDefined();
      expect(message.messageType).toEqual("success");
      expect(message.createdAtTimestampMiliseconds).toBeUndefined();
      expect(message.createdAtTimestampMilliseconds).toEqual(
        pair.createdAtTimestampMiliseconds,
      );
      expect(message.initialEntryInformation?.moneyExpent).toBeUndefined();
      expect(message.initialEntryInformation?.moneySpent).toEqual(
        pair.initialEntryInformation?.moneyExpent,
      );
    };
    checkSuccessMessage(
      messages.firstSuccessMessage,
      testMessages.firstSuccessMessage,
    );
    checkSuccessMessage(
      messages.secondSuccessMessage,
      testMessages.secondSuccessMessage,
    );
    const checkEntry = (entry: Entry & _EntryTypos, pair: EntryWithTypos) => {
      expect(entry).toBeDefined();
      expect(entry.moneyExpent).toBeUndefined();
      expect(entry.moneySpent).toEqual(pair.moneyExpent);
      expect(entry.createdAtTimestampMiliseconds).toBeUndefined();
      expect(entry.updatedAtTimestampMiliseconds).toBeUndefined();
      expect(entry.createdAtTimestampMilliseconds).toEqual(
        pair.createdAtTimestampMiliseconds,
      );
      expect(entry.updatedAtTimestampMilliseconds).toEqual(
        pair.updatedAtTimestampMiliseconds,
      );
    };
    checkEntry(entries.A, testEntries.A);
    checkEntry(entries.B, testEntries.B);
  });
});
