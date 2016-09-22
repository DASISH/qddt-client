import {Injectable} from 'angular2/core';

@Injectable()
export class UserService {

  user: string;

  constructor() {
    this.user = localStorage.getItem('user');
  }

  get() : any {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch(e) {
      this.user = null;
      return null;
    }
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
