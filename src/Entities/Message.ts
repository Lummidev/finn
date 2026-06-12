export interface Message {
  id: string;
  createdAtTimestampMilliseconds: number;
  messageType: "success" | "user" | "error";
  errorCode?: string;
  errorDetails?: string;
  content?: string;
  entryID?: string;
  initialEntryInformation?: {
    category?: {
      name: string;
      iconName?: string;
    };
    moneySpent: number;
    description: string;
  };
}
