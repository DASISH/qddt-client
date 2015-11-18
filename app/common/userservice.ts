import {Injectable} from 'angular2/angular2';

@Injectable()
export class UserService {

  user: string;

  constructor() {
    this.user = localStorage.getItem('user');
  }

  get() : string {
    return JSON.parse(this.user);
  }

  set(user: string) : string {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = JSON.stringify(user);
    return this.user;
  }

  remove() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    this.user = null;
  }
}
