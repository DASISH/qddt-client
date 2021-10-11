import { ElementKind } from '../enums';
import { UserJwt } from './user.classes';


export class ChangeLogJson {
  // changeFeedKey?: {};
  elementId?: string;
  elementKind?: ElementKind;
  elementRevision?: number;
  modifiedBy?: UserJwt;
  modified?: any;
  name: string;
  refChangeKind?: any;
  refKind?: string;

  public constructor(init?: Partial<ChangeLogJson>) {
    Object.assign(this, init);
  }

}
