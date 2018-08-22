export class User {
  id: string;
  sub: string; // -> name
  email: string;
  agency: string;
  role: Array<any>;
  exp: any;  // -> should be number, is expire date
  password?: string;
}
