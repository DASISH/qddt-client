export class User {
  userId:string;
  sub:string; // -> name
  email:string;
  agency:string;
  roles: string[];
  exp:any;  //-> should be number, is expire date
}
