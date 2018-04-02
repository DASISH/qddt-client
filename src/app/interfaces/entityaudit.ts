export interface IEntityAudit {
  id: string;
  name: string;
  classKind: string;
}

export interface IEntityEditAudit extends IEntityAudit {
  basedOnObject: string;
  basedOnRevision: number;
  modified: number;
  version: IVersion;
  agency: IEntityAudit;
}

export interface IVersion {
  major: string|number;
  minor: string|number;
  versionLabel: string;
  revision: string|number;
}

