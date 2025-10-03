export interface Message {
  id: string;
  createdAtTimestampMiliseconds: number;
  messageType: "success" | "user" | "error";
  entryID?: string;
  content?: string;
}
