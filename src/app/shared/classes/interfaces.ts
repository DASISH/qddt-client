import {ActionKind, ElementKind} from './enums';
import { Page } from './classes';

export interface IDetailAction {
  id: string;
  action: ActionKind;
  object: any;
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

export interface IElement {
  element: any;
  elementKind: ElementKind|string;
}

export interface IEntityAudit {
  id: string;
  name: string;
  classKind: string;
  comments?: IComment[];
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  agency?: IEntityAudit;
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

export interface IEntityEditAudit extends IEntityAudit {
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: IUser;
  version?: IVersion;
  agency?: IEntityAudit;
  archived?: boolean;
  otherMaterials?: IOtherMaterial[];
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

export interface IHeaderDetail {
  icon: any;
  headerName: string;
  kind: ElementKind;
}

export interface IPageResult<T> {
  content: T[];
  links: [ { href: string , rel: string } ];
  page: Page;
}

export interface IRevisionResultEntity {
  entity: IEntityEditAudit;
  metadata: { delegate: { id: number, timestamp: number }, revisionDate: any, revisionNumber: number };
  revisionDate: any;
  revisionNumber: number;
}
export interface IRevisionResult<T extends IEntityAudit> {
  entity: T;
  metadata: { delegate: { id: number, timestamp: number }, revisionDate: any, revisionNumber: number };
  revisionDate: any;
  revisionNumber: number;
}

export interface IPageSearch {
  kind: ElementKind;
  key: string;
  hasDetailSearch?: boolean;
  keys?: Map<string, string>;
  page?: Page;
  sort?: string;
}
