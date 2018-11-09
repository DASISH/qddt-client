import {Agency, User} from '../core/classes/index';


export class ChangeLogJson {

  id: string;
  name: string;
  agency: Agency;
  modified: number;
  modifiedBy: User;

  public constructor(init?: Partial<ChangeLogJson>) {
    Object.assign(this, init);
  }

}
