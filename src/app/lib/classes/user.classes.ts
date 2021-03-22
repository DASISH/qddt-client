import { IAuthority, IVersion } from '../interfaces';


export class Agency {
  id: string;
  name: string;
  description?: string;
  modified?: number;
  defaultXmlLang: string;
  classKind: string;
  version?: IVersion;
  users?: UserJson[];
  surveyPrograms?: SurveyJson[];
}


export class User {
  id: string;
  sub: string; // -> name
  email: string;
  agency?: Agency;
  modified?: number;
  role: string[]|string;
  exp: any;  // -> should be number, is expire date
  password?: string;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
    if (init && init.role){
      this.role = init.role.toString().split(',')
    }
  }
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

export class SurveyJson {
  id: string;
  name: string;
  modified: number;
  version: IVersion;
}
