import {User} from './user';
import {ElementKind} from '../enums';


export class ChangeLogJson {
  // changeFeedKey?: {};
  elementId?: string;
  elementKind?: ElementKind;
  elementRevision?: number;
  modifiedBy?: User;
  modified?: any;
  name: String;
  refChangeKind?: any;
  refKind?: String;

  public constructor(init?: Partial<ChangeLogJson>) {
    Object.assign(this, init);
  }

}
