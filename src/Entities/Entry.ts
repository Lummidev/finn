export interface Entry {
  id: string;
  moneyExpent: number;
  description: string;
  createdAtTimestampMiliseconds: number;
  categoryID?: string;
}
