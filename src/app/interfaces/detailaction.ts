export enum ActionDetail {
  None,
  Created,
  Updated,
  Deleted
}

export interface IDetailAction {
  id: string;
  action: ActionDetail;
  object: any;
}
