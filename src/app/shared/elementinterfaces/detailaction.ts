export enum Action {
  None,
  Read,
  Create,
  Update,
  Delete
}

export interface IDetailAction {
  id: string;
  action: Action;
  object: any;
}
