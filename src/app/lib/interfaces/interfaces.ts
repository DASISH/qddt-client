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

export interface IIdRef {
  elementId: string;
  elementKind: ElementKind|string;
}


export interface IRevisionRef extends IIdRef {
  elementId: string;
  elementRevision: number;
  elementKind: ElementKind|string;
}

export interface IRef {
  id: string;
  name: string;
  parent?: IRef;
}


export interface IElement {
  element: any;
  elementKind: ElementKind|string;
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


