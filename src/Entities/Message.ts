export interface Message {
  id: string;
  createdAtTimestampMiliseconds: number;
  messageType: "success" | "user" | "error";
  content?: string;
  entryID?: string;
  initialEntryInformation?: {
    categoryName?: string;
    moneyExpent: number;
    description: string;
  };
}
