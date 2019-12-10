import {ActionKind, ElementKind} from '../enums';

export interface MenuItem { id: string; name: string; }

export interface IDetailAction {
  id: string;
  action: ActionKind;
  object: any;
}

export interface IMoveTo {
  index: number;
  target: string;
  source: string;
}

export interface IElement {
  element: any;
  elementKind: ElementKind|string;
}

export interface IElementRef {
  elementId: string;
  elementKind: ElementKind|string;
}

export interface IRevisionRef extends IElementRef {
  elementId: string;
  elementRevision: number;
  elementKind: ElementKind|string;
}

export interface ITreeRef {
  id: string;
  name: string;
  parent?: ITreeRef;
}

export interface ISelectItem {
  id: number;
  text: string;
  value: any;
  children?: ISelectItem[];
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  modified?: number;
  agencyName?: string;
}

export interface IComment {
  comment: string;
  public: boolean;
  comments?: IComment[];
  size: number;
  modifiedBy?: IUser;
  modified?: number;
  ownerId?: string;
  ownerIdx?: number;
  id?: string;
}

export interface IVersion {
  major: string|number;
  minor: string|number;
  versionLabel?: string;
  revision?: string|number;
}

export interface IOtherMaterial {
  fileName: string;
  originalName: string;
  originalOwner: string;
}

export interface IAuthority {
  id: string;
  name: string;
  authority: string;
}


