export interface Message {
  id: string;
  createdAtTimestampMiliseconds: number;
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
    moneyExpent: number;
    description: string;
  };
}
