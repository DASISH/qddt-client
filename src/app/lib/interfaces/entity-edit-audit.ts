import { IComment, IOtherMaterial, IUser, IVersion } from './interfaces';
import { Agency } from '../classes';
import { HalLink, HalResource } from './http.interfaces';


export interface IEntityAudit {
  id: string;
  name: string;
  classKind: string;
  xmlLang?: string;
}

export interface IEntityEditAudit extends IEntityAudit {
  [x: string]: any;
  basedOnObject?: string;
  basedOnRevision?: number;
  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: IUser | string;
  version?: IVersion;
  agency?: Agency;
  archived?: boolean;
  otherMaterials?: IOtherMaterial[];
  comments?: IComment[];
  _links?: {
    [rel: string]: HalLink | HalLink[];
  };
  _embedded?: {
    [rel: string]: HalResource | HalResource[];
  };
}


export interface ILabel extends IEntityAudit {
  label: string;
}
