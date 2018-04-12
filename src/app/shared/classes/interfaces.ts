import {ActionKind, ElementKind} from './enums';
import {Page} from './classes';

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

export interface IElementRef {
  element: any;
  elementKind: ElementKind|string;
}

export interface IEntityAudit {
  id: string;
  name: string;
  classKind: string;
  comments?: any[];
}

export interface IEntityEditAudit extends IEntityAudit {
  basedOnObject?: string;
  basedOnRevision?: number;
  modified?: number;
  version?: IVersion;
  agency?: IEntityAudit;
  archived?: boolean;
}

export interface IVersion {
  major: string|number;
  minor: string|number;
  versionLabel?: string;
  revision?: string|number;
}

export interface IOtherMaterial {
  id: string;
  name: string;
  originalName: string;
}


export interface IHeaderDetail {
  icon: any;
  headerName: string;
  kind: ElementKind;
  action ?: string;
}


export interface IPageResult {
  content: any[];
  links: [ { href: string , rel: string } ];
  page: Page;
}
