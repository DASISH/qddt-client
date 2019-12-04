import {IComment, IOtherMaterial, IUser, IVersion} from './interfaces';


export interface IEntityAudit {
  id: string;
  name: string;
  classKind: string;
  xmlLang?: string;
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
  comments?: IComment[];
}


