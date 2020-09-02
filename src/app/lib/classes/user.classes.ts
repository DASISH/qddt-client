import { SurveyProgram } from './home.classes';
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
  role: Array<any>;
  exp: any;  // -> should be number, is expire date
  password?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
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
