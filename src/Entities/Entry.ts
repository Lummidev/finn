export interface Entry {
  id: string;
  moneyExpent: number;
  description: string;
  createdAtTimestampMiliseconds: number;
  updatedAtTimestampMiliseconds?: number;
  categoryID?: string;
}
