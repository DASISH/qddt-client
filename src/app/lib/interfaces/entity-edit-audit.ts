import { IComment, IOtherMaterial, IVersion } from './interfaces';
import { Agency } from '../classes';
import { HalLink } from './http.interfaces';
import { User } from '../classes/user.classes';


export interface IEntityAudit {
  id: string;
  name: string;
  basedOn?: IRevId;
  classKind: string;
  xmlLang?: string;
  _links?: {
    [rel: string]: HalLink | HalLink[];
  };
  _embedded?: {
    [rel: string]: any;
  };
}

export interface IRevId { id?: string; rev?: number }

export interface IEntityEditAudit extends IEntityAudit {
  changeComment?: string;
  changeKind?: string;
  modified?: number;
  modifiedBy?: User | string;
  version?: IVersion;
  agency?: Agency;
  isArchived?: boolean;
  otherMaterials?: IOtherMaterial[];
  comments?: IComment[];

  [x: string]: any;
}


export interface ILabel extends IEntityAudit {
  label: string;
}
