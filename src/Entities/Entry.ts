export interface Entry {
  id: string;
  moneySpent: number;
  description: string;
  createdAtTimestampMilliseconds: number;
  updatedAtTimestampMilliseconds?: number;
  note?: string;
  categoryID?: string;
}
