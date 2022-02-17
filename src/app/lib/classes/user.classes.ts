import { HalLink, IVersion } from '../interfaces';


export class Agency {
  id: string;
  name: string;
  description?: string;
  modified?: number;
  xmlLang: string;
  classKind: string;
  version?: IVersion = { major: 1, minor: 0 };
  _links?: {
    [rel: string]: HalLink;
  };
  _embedded?: {
    [rel: string]: any;
  };
  public constructor(init?: Partial<Agency>) {
    Object.assign(this, init);
  }
}


export class UserJwt {
  id: string;
  sub: string; // -> name
  email: string;
  agency?: Agency;
  modified?: number;
  role: string[] | string;
  exp: any;  // -> should be number, is expire date
  password?: string;

  public constructor(init?: Partial<UserJwt>) {
    Object.assign(this, init);
    if (init && init.role) {
      this.role = init.role.toString().split(',')
    }
  }
}

export class User {
  id: string;
  username: string;
  email: string;
  authority?: string[] | string;
  isEnabled?: boolean;
  userAgencyName?: string;
  _embedded?: {
    [rel: string]: any;
  };
  get name(): string {
    return this.username;
  }
  classKind: string = "User"
  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

}

export class SurveyJson {
  id: string;
  name: string;
  modified: number;
  version: IVersion;
}
