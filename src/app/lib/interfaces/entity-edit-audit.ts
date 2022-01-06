import { IComment, IOtherMaterial, IUser, IVersion } from './interfaces';
import { Agency } from '../classes';
import { HalLink } from './http.interfaces';
import { User } from '../classes/user.classes';
import * as uuid from 'uuid';


export interface IEntityAudit {
  id: string;
  name: string;
  classKind: string;
  xmlLang?: string;
}

export interface IRevId {id:uuid; rev?: number}

export interface IEntityEditAudit extends IEntityAudit {
  [x: string]: any;
  basedOn?: IRevId;
  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: User | string;
  version?: IVersion;
  agency?: Agency;
  archived?: boolean;
  otherMaterials?: IOtherMaterial[];
  comments?: IComment[];
  _links?: {
    [rel: string]: HalLink | HalLink[];
  };
  _embedded?: {
    [rel: string]: IEntityEditAudit;
  };
}


export interface ILabel extends IEntityAudit {
  label: string;
}
