import { IAuthority } from '../interfaces';


export class Agency {
  id: string;
  name: string;
  modified?: number;
  classKind?: string;
  users?: UserJson[];
}


export class UserJson {
  id: string;
  name: string;
  email: string;
  agency: Agency;
  modified: number;
  authorities?: IAuthority[] = [{ id: 'null', name: 'none', authority: 'NONE' }];
  enabled = true;
  classKind: 'USER';
  public constructor(init?: Partial<UserJson>) {
    Object.assign(this, init);
  }

}
