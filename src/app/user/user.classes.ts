import { IEntityEditAudit, IVersion } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { Page } from '../shared/classes/classes';
import { ParseErrorLevel } from '@angular/compiler';
import { Agency } from '../core/user/user.service';


export interface IAuthority {
  id: string;
  name: string;
  authority: string;
}



export class UserJson {

  id: string;
  name: string;
  email: String;
  agency: Agency;
  modified: number;
  authorities: IAuthority[] = [ {id: 'null', name: 'none', authority: 'NONE' } ];
  enabled: boolean;
  classKind: 'USER';

  public constructor(init?: Partial<UserJson>) {
    Object.assign(this, init);
  }

}
