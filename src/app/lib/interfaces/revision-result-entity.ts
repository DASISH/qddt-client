import { IUser , IEntityEditAudit, IEntityAudit} from '.';

export interface IRevisionResultEntity {
  entity: IEntityEditAudit;
  revisionModifiedBy?: IUser;
  metadata: { delegate: { id: number, timestamp: number, modifiedBy: IUser }, revisionDate: any, revisionNumber: number };
  revisionDate: any;
  revisionNumber: number;
}

export interface IRevisionResult<T extends IEntityAudit> {
  entity: T;
  metadata: { delegate: { id: number, timestamp: number, modifiedBy: IUser }, revisionDate: any, revisionNumber: number };
  revisionDate: any;
  revisionNumber: number;
}
