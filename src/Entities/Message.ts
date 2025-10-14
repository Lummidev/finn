export interface Message {
  id: string;
  createdAtTimestampMiliseconds: number;
  messageType: "success" | "user" | "error";
  content?: string;
  entryID?: string;
  initialEntryInformation?: {
    category?: {
      name: string;
      iconName?: string;
    };
    moneyExpent: number;
    description: string;
  };
}
