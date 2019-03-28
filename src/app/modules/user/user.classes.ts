export interface IAuthority {
  id: string;
  name: string;
  authority: string;
}


export class Agency  {
  id: string;
  name: string;
}


export class UserJson {

  id: string;
  name: string;
  email: String;
  agency: Agency;
  modified: number;
  authorities?: IAuthority[] = [ {id: 'null', name: 'none', authority: 'NONE' } ];
  enabled = true;
  classKind: 'USER';
  public constructor(init?: Partial<UserJson>) {
    Object.assign(this, init);
  }

}
