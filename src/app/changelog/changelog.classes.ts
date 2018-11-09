import {Agency} from '../core';


export interface IAuthority {
  id: string;
  name: string;
  authority: string;
}

export class ChangeLogJson {

  id: string;
  name: string;
  email: String;
  agency: Agency;
  modified: number;
  authorities: IAuthority[] = [ {id: 'null', name: 'none', authority: 'NONE' } ];
  enabled = true;
  classKind: 'USER';

  public constructor(init?: Partial<ChangeLogJson>) {
    Object.assign(this, init);
  }

}
